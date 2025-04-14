import React, { useState } from "react";
import { MoreDotIcon } from "../../icons";
import SwalWithBootstrapButtons from "../../components/common/SwalWithBootstrapButtons";
import axiosInstance from "../../common/configs/axiosInstance";
import Swal from "sweetalert2";
import { Dropdown } from "../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../components/ui/dropdown/DropdownItem";
import { User } from "../../common/types/AuthTypes";

interface UserActionDropdownProps {
  user?: User;
  onReload: () => void;
}

const UserActionDropdown: React.FC<UserActionDropdownProps> = ({ user, onReload }) => {

  const [isOpen, setIsOpen] = useState<boolean>(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  const handleDeleteUser = async () => {
    try {
      SwalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await axiosInstance.delete(`/User/${user?.id}`);
          if (response.status === 200 || response.status === 201) {
            Swal.fire({
              title: "Successfully",
              text:
                response?.data?.message ??
                "Xoá người dùng với " + user?.id + " thành công !",
              icon: "success",
            }).then(() => {
              onReload();
            });
          }
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          SwalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your imaginary file is safe :)",
            icon: "error",
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="relative inline-block">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        <MoreDotIcon className="text-gray-400 hover:text-gray-700 rotate-90 dark:hover:text-gray-300 size-6" />
      </button>
      <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
        <DropdownItem
          tag="a"
          to={{
            pathname: `/profile/${user?.id}`,
            state: { user }, // truyền user vào state
          }}
          onItemClick={closeDropdown}
          className="flex items-center gap-3 px-3 py-2 w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          <svg
            className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM17.0246 18.8566V18.8455C17.0246 16.7744 15.3457 15.0955 13.2746 15.0955H10.7246C8.65354 15.0955 6.97461 16.7744 6.97461 18.8455V18.856C8.38223 19.8895 10.1198 20.5 12 20.5C13.8798 20.5 15.6171 19.8898 17.0246 18.8566ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9991 7.25C10.8847 7.25 9.98126 8.15342 9.98126 9.26784C9.98126 10.3823 10.8847 11.2857 11.9991 11.2857C13.1135 11.2857 14.0169 10.3823 14.0169 9.26784C14.0169 8.15342 13.1135 7.25 11.9991 7.25ZM8.48126 9.26784C8.48126 7.32499 10.0563 5.75 11.9991 5.75C13.9419 5.75 15.5169 7.32499 15.5169 9.26784C15.5169 11.2107 13.9419 12.7857 11.9991 12.7857C10.0563 12.7857 8.48126 11.2107 8.48126 9.26784Z"
              fill=""
            />
          </svg>
          View More
        </DropdownItem>
        <DropdownItem
          tag="a"
          onItemClick={handleDeleteUser}
          className="flex items-center gap-3 px-3 py-2 font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Delete
        </DropdownItem>
        <DropdownItem
          tag="a"
          onItemClick={closeDropdown}
          className="flex items-center gap-3 px-3 py-2 font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Close
        </DropdownItem>
      </Dropdown>
    </div>
  );
};

export default UserActionDropdown;
