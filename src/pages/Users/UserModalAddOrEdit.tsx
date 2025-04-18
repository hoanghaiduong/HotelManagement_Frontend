import React, { useCallback, useEffect, useState } from "react";
import { Modal } from "../../components/ui/modal";
import { Role, User } from "../../common/types/AuthTypes";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import MultiSelect, { Option } from "../../components/form/MultiSelect";
import axiosInstance from "../../common/configs/axiosInstance";
import FileUploadForm from "./UserUploadForm";
import Swal from "sweetalert2";
import { useAppDispatch } from "../../redux/store";

interface UserModalAddOrEditProps {
  isOpen: boolean;
  closeModal: () => void;
  user?: User;
  onRefresh?: () => void;
}

const UserModalAddOrEdit: React.FC<UserModalAddOrEditProps> = ({
  isOpen,
  closeModal,
  user,
  onRefresh,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]); // Initialize as empty array
  const [userData, setUserData] = useState<User>({
    email: "",
    password: "",
    avatar: "",
    address: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    roles: [],
  });

  const [options, setOptions] = useState<Option[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/Role");
      if (response.status === 200 || response.status === 201) {
        setRoles(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    setOptions(
      roles.map((item) => ({
        text: item.name,
        value: item.id.toString(),
      }))
    );
  }, [roles]); // Removed selectedValues from dependencies to prevent unnecessary updates

  useEffect(() => {
    if (user && user !== null) {
      setUserData(user);
      setSelectedValues(user.roles?.map((item) => item.id.toString()) || []);
    } else {
      setUserData({
        email: "",
        password: "",
        avatar: "",
        address: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        roles: [],
      });
      setSelectedValues([]);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file: File | null, preview: string | null) => {
    setSelectedFile(file);
    setPreviewUrl(preview);
  };

  const handleSave = async () => {
    const formData = new FormData();
    if (!user) {
      formData.append("Email", userData.email);
      formData.append("Password", userData.password);
    }
    formData.append("FirstName", userData.firstName);
    formData.append("LastName", userData.lastName);
    formData.append("phoneNumber", userData.phoneNumber);
    if (selectedFile) {
      formData.append("Avatar", selectedFile, selectedFile.name);
    }
    if (selectedValues.length > 0) {
      selectedValues.forEach((val) => formData.append("Roles", val));
    }
    try {
      let response;
      if (user) {
        response = await axiosInstance.put(`/User/${userData.id}`, formData);
      } else {
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

  const handleChangeOptions = (selected: string[]) => {
    setSelectedValues(selected);
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {user ? "Edit" : "Add"} Personal Information
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Update your details to keep your profile up-to-date.
          </p>
        </div>
        <div className="flex flex-col">
          <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
            <div className="mt-2">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Personal Information
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label>First Name</Label>
                  <Input
                    type="text"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Last Name</Label>
                  <Input
                    type="text"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Email Address</Label>
                  <Input
                    type="text"
                    name="email"
                    value={userData.email}
                    disabled={user !== undefined}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Phone</Label>
                  <Input
                    type="text"
                    name="phoneNumber"
                    value={userData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>

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
                {/* Roles Combobox */}
                <div className="col-span-2">
                  <MultiSelect
                    label="Multiple Select Options"
                    options={options}
                    defaultSelected={selectedValues}
                    onChange={handleChangeOptions}
                  />
                  <p className="sr-only">
                    Selected Values: {selectedValues.join(", ")}
                  </p>
                </div>

                {/* Upload File */}
                <FileUploadForm
                  currentUser={userData}
                  onFileChange={handleFileChange}
                />
              </div>
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
