import axios from "axios";
import Constants from "./Constants";
import { store } from "../../redux/store";
import { logout, setToken } from "../../redux/slices/authSlice";
const axiosInstance = axios.create({
  baseURL: Constants.BASE_URL_BACKEND + "/api", // Prefix API
  timeout: 10000, // Thời gian timeout (10 giây)
  // headers: {
  // "Content-Type": "application/json",
  // },
});
let isRefreshing = false;
let failedQueue: any[] = [];
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};
axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().auth.token?.accessToken;
  console.log(token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
axiosInstance.interceptors.response.use(
  (response) => response, // Giữ nguyên dữ liệu trả về nếu không có lỗi
  async (error) => {
    const originalRequest = error.config;
    // Nếu token hết hạn (401) và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (isRefreshing) {
        // Nếu đang refresh token, xếp hàng đợi
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest)); // Gửi lại request sau khi có token mới
            },
            reject: (err: any) => reject(err),
          });
        });
      }
      isRefreshing = true;
      try {
        // Gọi API /refreshtoken để lấy token mới
        const res = await axiosInstance.post("/Auth/refresh-token", {
          refreshToken: store.getState().auth.token?.refreshToken, // Lấy refresh tokentừ store
        });

        const { accessToken, refreshToken } = res.data; // Giả sử trả về accessToken mới
        store.dispatch(setToken({ accessToken, refreshToken })); // Lưu accessToken mới vào Redux
        processQueue(null, accessToken); // Xử lý tất cả các request đợi queue
        // Gửi lại request ban đầu với accessToken mới
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null); // Nếu refresh thất bại, gọi logout
        store.dispatch(logout());
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
