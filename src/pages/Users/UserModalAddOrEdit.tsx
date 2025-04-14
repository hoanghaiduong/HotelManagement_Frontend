import React, { useEffect, useState } from "react";
import { Role, User } from "../../common/types/AuthTypes";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { fetchRoles } from "../../redux/slices/role/roleThunk";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import MultiSelect from "../../components/form/MultiSelect";
import Button from "../../components/ui/button/Button";
import FileUploadForm from "./UserUploadForm";
import axiosInstance from "../../common/configs/axiosInstance";
import Swal from "sweetalert2";

interface UserModalAddProps {
  user?: User;
  isOpen: boolean;
  closeModal: () => void;
  onRefresh?: () => void;
}

const UserModalAddOrEdit: React.FC<UserModalAddProps> = ({
  user,
  isOpen,
  closeModal,
  onRefresh, // callback truyền từ component cha
}) => {
  // State cho thông tin người dùng
  const [userData, setUserData] = useState<User>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    avatar: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [multiOptions, setMultiOptions] = useState<
    { value: string; text: string; selected: boolean }[]
  >([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const dispatch = useAppDispatch();
  const {
    data: roles,
    loading,
    error,
  } = useAppSelector((state) => state.roles);

  // Cập nhật dữ liệu form khi nhận prop user (cho chế độ sửa) hoặc reset khi thêm mới
  useEffect(() => {
    if (user) {
      setUserData({
        email: user.email,
        password: "",
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      });
      // Nếu user có danh sách role, cập nhật selectedValues ngay lúc này
      if (user.roles) {
        setSelectedValues(user.roles.map((role: Role) => role.id.toString()));
      }
    } else {
      setUserData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        avatar: "",
      });
      setSelectedValues([]);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [user]);

  // Gọi API lấy danh sách roles khi modal mở
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchRoles());
    }
  }, [isOpen, dispatch]);

  // Khi dữ liệu roles từ Redux hoặc prop user thay đổi, chuyển đổi thành định dạng cho MultiSelect
  useEffect(() => {
    if (roles) {
      let formatted = roles.map((role: Role) => ({
        value: role.id.toString(),
        text: role.name,
        selected: false,
      }));
      // Nếu có user và user.roles thì đánh dấu các option đã được chọn
      if (user && user.roles) {
        formatted = formatted.map((option) => ({
          ...option,
          selected: user?.roles?.some(
            (uRole: Role) => uRole.id.toString() === option.value
          ),
        }));
      }
      setMultiOptions(formatted);
    }
  }, [roles, user]);

  // Callback khi MultiSelect thay đổi (cập nhật selectedValues từ component con)
  const handleMultiSelectChange = (selected: string[]) => {
    setSelectedValues(selected);
  };

  // Xử lý thay đổi cho các Input (email, password, firstName, lastName)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Callback cho FileUploadForm
  const handleFileChange = (file: File | null, preview: string | null) => {
    setSelectedFile(file);
    setPreviewUrl(preview);
  };

  // Submit form: Tạo FormData, append các giá trị, file và role(s)
  // Submit form: Tạo FormData, append các giá trị, file và role(s)
  const handleSave = async () => {
    const formData = new FormData();
    if (!user) {
      formData.append("Email", userData.email);
      formData.append("Password", userData.password);
    }

    formData.append("FirstName", userData.firstName);
    formData.append("LastName", userData.lastName);

    if (selectedFile) {
      formData.append("Avatar", selectedFile, selectedFile.name);
    }

    // Gửi danh sách role đã chọn
    if (selectedValues.length > 0) {
      selectedValues.forEach((val) => formData.append("Roles", val));
    }

    try {
      let response;
      if (user) {
        // Cập nhật người dùng: dùng PUT hoặc PATCH
        response = await axiosInstance.put(`/User/${user.id}`, formData);
      } else {
        // Tạo mới người dùng
        response = await axiosInstance.post("/User", formData);
      }
      if (
        response.data != null &&
        (response.status === 200 || response.status === 201)
      ) {
        await Swal.fire({
          title: "Thành công",
          text: user
            ? "Cập nhật người dùng thành công"
            : "Thêm người dùng thành công",
          icon: "success",
          customClass: {
            container: "swal-container",
            htmlContainer: "swal-container",
          },
        });
        // Gọi callback onRefresh từ component cha nếu có
        if (onRefresh) {
          onRefresh();
        }
        closeModal();
      }
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: error?.message,
        icon: "error",
        customClass: {
          container: "swal-container",
          htmlContainer: "swal-container",
        },
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
      <div className="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {user ? "Sửa thông tin người dùng" : "Thêm mới người dùng"}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {user
              ? "Điền thông tin người dùng cần cập nhật."
              : "Vui lòng nhập thông tin người dùng."}
          </p>
        </div>
        <div className="flex flex-col">
          <div className="h-[500px] overflow-y-auto px-2 pb-3">
            <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Email */}
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  disabled={user != null}
                  value={userData.email}
                  onChange={handleChange}
                  placeholder="info@gmail.com"
                />
              </div>
              {/* Hiển thị password chỉ khi thêm mới */}
              {!user && (
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={userData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* First Name */}
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={userData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                />
              </div>
              {/* Last Name */}
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={userData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div className="mt-7">
              <MultiSelect
                label="Gán quyền cho User"
                options={multiOptions}
                defaultSelected={selectedValues}
                onChange={handleMultiSelectChange}
              />
              <p className="sr-only">
                Selected Values: {selectedValues.join(", ")}
              </p>
            </div>
            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">
                Upload Avatar
              </h5>
              <FileUploadForm
                currentUser={user}
                onFileChange={handleFileChange}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Close
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserModalAddOrEdit;
