import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import Badge from "../../../components/ui/badge/Badge";
import UserActionDropdown from "../UserActionDropdown";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import Button from "../../../components/ui/button/Button";
import { useCallback, useEffect, useState } from "react";
import TableControls from "../../../components/common/TableControls";
import Swal from "sweetalert2";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { fetchUsers } from "../../../redux/slices/user/userThunks";
import Constants from "../../../common/configs/Constants";
import Pagination from "../../../components/common/Pagination";

interface UsersTableProps {
  reload: number;
  onReload: () => void;
}
const UsersTable: React.FC<UsersTableProps> = ({ reload,onReload }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [option, setSelectOption] = useState<string>(""); // Mảng lưu id của user được chọn
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]); // Mảng lưu id của user được chọn
  const dispatch = useAppDispatch();
  const {
    data: users,
    selectedUser,
    loading,
    error,
  } = useAppSelector((state) => state.users);

  const options = [
    { value: "delete", label: "Xoá" },
    { value: "add", label: "Thêm" },
  ];
  // Hàm debounce để trì hoãn tìm kiếm
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };
  // Hàm xử lý tìm kiếm với debounce
  const handleSearchChange = debounce((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  }, 500);
  const handleSelectChange = (value: string) => {
    setSelectOption(value);
  };
  const handleAction = () => {
    if (option === "add") {
      alert("thêm mới");
    } else if (option === "delete") {
      if (selectedUsers && selectedUsers.length > 0) {
        alert("Xoá");
      }
    }
  };

  // Memoize hàm fetchUsers để tránh tạo lại hàm không cần thiết
  const GetUsers = useCallback(async () => {
    try {
      // Chỉ thêm tham số Search nếu searchTerm không rỗng hoặc null
      dispatch(
        fetchUsers({
          PageNumber: currentPage,
          PageSize: pageSize,
          Depth: 1,
          Search: searchTerm,
        })
      );
      const pagination = users.pagination;
      if (users.pagination) {
        setTotalPages(pagination?.totalPages!);
        setTotalCount(pagination?.totalCount!);
      }
    } catch (error) {
      console.error("Lỗi khi fetch user:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Không thể tải dữ liệu người dùng",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }, [currentPage, pageSize, searchTerm]);

  // Gọi fetchUsers khi dependencies thay đổi
  useEffect(() => {
    GetUsers();
  }, [GetUsers, reload]);
  const removeUsers = async () => {};
  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="space-y-4">
            <div className="mx-5 mt-2 mb-2 w-fit flex flex-row justify-around items-center">
              <Label className="mr-4">Chọn hành động</Label>
              <Select
                options={options}
                placeholder="Select Option"
                onChange={handleSelectChange}
                className="dark:bg-dark-900 flex-1"
              />

              <Button
                onClick={handleAction}
                size="sm"
                className="ml-2"
                variant="primary"
              >
                Thực hiện
              </Button>
            </div>
            <TableControls
              containerStyle="py-0 px-4"
              onSearchChange={handleSearchChange}
              onEntriesChange={(value) => {
                setPageSize(value);
                setCurrentPage(1); // Reset về trang đầu khi thay đổi kích thước trang
              }}
            />
          </div>
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Avatar
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Roles
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {users &&
                users.items.map((item, idx) => {
                  return (
                    <>
                      <TableRow>
                        <TableCell className="px-5 py-4 sm:px-6 text-center w-5">
                          <div className="flex items-center ">
                            <div className="w-[150px] h-[150px]  overflow-hidden flex rounded-full">
                              <img
                                src={`${Constants.BASE_URL_BACKEND}/${item.avatar}`}
                                className="w-[200px] "
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {item.email}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {item?.roles?.map((item2, idx2) => {
                            return (
                              <Badge
                                size="md"
                                color={
                                  item2.name === "Admin"
                                    ? "error"
                                    : item2.name === "Guest"
                                    ? "info"
                                    : "success"
                                }
                              >
                                <div className="p-2"> {item2.name}</div>
                              </Badge>
                            );
                          })}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <UserActionDropdown user={item} onReload={onReload}  />
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default UsersTable;
