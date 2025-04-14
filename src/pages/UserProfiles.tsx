import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import { selectUser } from "../redux/slices/auth/authSlice";
import { User } from "../common/types/AuthTypes";
import Swal from "sweetalert2";
import axiosInstance from "../common/configs/axiosInstance";

const UserProfiles: React.FC = () => {
  const { id } = useParams();
  const currentUser: User | null = useSelector(selectUser);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<number>(0); // State điều khiển reload
  useEffect(() => {
    if (!id) {
      // Nếu không có id -> đang xem profile chính mình
      setUserData(currentUser);
    } else {
      // Nếu có id -> call API để lấy user khác
      const fetchUser = async () => {
        try {
          const res = await axiosInstance.get(`/user/${id}?depth=1`);
          console.log(res);
          setUserData(res.data);
        } catch (error) {
          console.error("Failed to fetch user", error);
          Swal.fire("Lỗi", "Không tìm thấy người dùng", "error");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id, currentUser, reload]);

  if (loading) {
    Swal.fire({
      title: "Loading...",
      text: "Đang tải dữ liệu",
      icon: "warning",
      showConfirmButton: false,
      timer: 500,
    });
  }

  return (
    <>
      <PageMeta title="Hồ sơ người dùng" description="Thông tin người dùng" />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard
            user={userData}
            triggerReload={() => setReload((prev) => prev + 1)}
          />
          <UserInfoCard user={userData} />
          {/* <UserAddressCard user={userData} /> */}
        </div>
      </div>
    </>
  );
};

export default UserProfiles;
