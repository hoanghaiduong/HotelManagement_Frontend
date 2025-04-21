import React, { useCallback, useEffect, useState } from "react";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import Button from "../../../components/ui/button/Button";
import axiosInstance from "../../../common/configs/axiosInstance";
import Swal from "sweetalert2";
import { RoomType } from "../../../common/types/RoomType";
import TableControls from "../../../components/common/TableControls";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import Checkbox from "../../../components/form/input/Checkbox";
import RoomTypeSlider from "./RoomTypeSlider";
import Badge from "../../../components/ui/badge/Badge";
import RoomTypeActionDropdown from "./RoomTypeActionDropdown";
import Pagination from "../../../components/common/Pagination";
interface RoomTypesTableProps {
  reload: number;
  onReload: () => void;
}
const RoomTypesTable: React.FC<RoomTypesTableProps> = ({
  reload,
  onReload,
}) => {
  const [roomTypeList, setRoomTypeList] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [option, setSelectOption] = useState<string>(""); // Mảng lưu id của roomType được chọn
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<number[]>([]); // Mảng lưu id của roomType được chọn
  const options = [
    { value: "delete", label: "Xoá" },
    { value: "add", label: "Thêm" },
  ];
  const handleSelectChange = (value: string) => {
    setSelectOption(value);
  };
  // Hàm debounce để trì hoãn tìm kiếm
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Chọn tất cả: lấy tất cả ID từ roomTypeList
      setSelectedRoomTypes(roomTypeList.map((roomType) => roomType.id!));
    } else {
      // Bỏ chọn tất cả: đặt lại mảng rỗng
      setSelectedRoomTypes([]);
    }
  };

  // Xử lý khi checkbox thay đổi
  const handleCheckboxChange = (roomTypeId: number) => {
    setSelectedRoomTypes(
      (prevSelected) =>
        prevSelected.includes(roomTypeId)
          ? prevSelected.filter((id) => id !== roomTypeId) // Bỏ chọn
          : [...prevSelected, roomTypeId] // Chọn thêm
    );
  };

  // Memoize hàm fetchRoomTypes để tránh tạo lại hàm  không cần thiết
  const fetchRoomTypes = useCallback(async () => {
    setLoading(true);
    try {
      // Chỉ thêm tham số Search nếu searchTerm không rỗng hoặc null
      const searchParam = searchTerm ? `&Search=${searchTerm}` : "";
      const result = await axiosInstance.get(
        `/RoomType?PageNumber=${currentPage}&PageSize=${pageSize}&Depth=1${searchParam}`
      );
      const data = result?.data;
      if (data) {
        setRoomTypeList(data.items);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
      }
    } catch (error) {
      console.error("Lỗi khi fetch roomType:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Không thể tải dữ liệu người dùng",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchTerm]);
  // Gọi fetchRoomTypes khi dependencies thay đổi
  useEffect(() => {
    fetchRoomTypes();
  }, [fetchRoomTypes, reload]);

  // Hàm xử lý tìm kiếm với debounce
  const handleSearchChange = debounce((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  }, 500);

  const handleAction = () => {
    if (option === "add") {
      alert("thêm mới");
    } else if (option === "delete") {
      if (selectedRoomTypes && selectedRoomTypes.length > 0) {
        removeRoomTypes();
      }
    }
  };

  const removeRoomTypes = async () => {
    try {
      const response = await axiosInstance.delete("/RoomType/ids", {
        data: {
          roomTypeIds: selectedRoomTypes,
        },
      });
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: "Successfully",
          text: "Xoá nhiều loại phòng thành công",
          icon: "success",
        }).then(() => {
          // Clear selection after deletion
          setSelectedRoomTypes([]);
          // Refresh the roomType list by calling fetchRoomTypes directly
          onReload();
        });
      }
    } catch (error) {
    } finally {
    }
  };
  return (
    <div>
      <div
        className="overflow-hidden rounded-xl
border border-gray-200 bg-white
dark:border-white/[0.05] dark:bg-white/[0.03]"
      >
        <div className="max-w-full overflow-x-auto">
          <div className="space-y-4">
            <div className="mx-4 mt-2 mb-2 flex flex-col xsm:flex xsm:justify-around xsm:items-center xsm:flex-row">
              <Label className="mr-4 mt-2.5 mb-1.5">Chọn hành động</Label>
              <Select
                options={options}
                placeholder="Select Option"
                onChange={handleSelectChange}
                className="dark:bg-dark-900 flex-1 mt-2.5 mb-1.5"
              />

              <Button
                onClick={handleAction}
                size="sm"
                className="xsm:ml-2 mt-2.5 mb-1.5"
                variant="primary"
              >
                Thực hiện
              </Button>
              <Button
                onClick={() => {
                  onReload();
                }}
                size="sm"
                className="xsm:ml-2 mt-2.5 mb-1.5"
                variant="outline"
              >
                Làm mới
              </Button>
            </div>

            {/* Tìm kiếm và hiển thị */}
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
            <TableHeader
              className="border-b
border-gray-100 dark:border-white/[0.05]"
            >
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium
text-gray-500 text-start text-theme-xs
dark:text-gray-400"
                >
                  <Checkbox
                    onChange={handleSelectAll}
                    checked={
                      roomTypeList.length > 0 &&
                      selectedRoomTypes.length === roomTypeList.length
                    }
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-2 font-medium
text-gray-500 text-start text-theme-xs
dark:text-gray-400 hidden"
                >
                  ID
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-2 font-medium
text-gray-500 text-start text-theme-xs
dark:text-gray-400"
                >
                  Loại phòng
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-2 font-medium
text-gray-500 text-start text-theme-xs
dark:text-gray-400"
                >
                  Hình ảnh
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-2 font-medium
text-gray-500 text-start text-theme-xs
dark:text-gray-400"
                >
                  Mô tả
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-2 font-medium
text-gray-500 text-start text-theme-xs
dark:text-gray-400"
                >
                  Giá/(đêm)
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-2 font-medium
text-gray-500 text-start text-theme-xs
dark:text-gray-400"
                >
                  Thông tin cơ bản
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-2 font-medium
text-gray-500 text-start text-theme-xs
dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody
              className="divide-y
divide-gray-100 dark:divide-white/[0.05]
dark:text-white"
            >
              {loading ? (
                <TableRow>
                  <TableCell
                    className="text-center
py-4"
                  >
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : (
                roomTypeList &&
                roomTypeList.map((item: RoomType) => (
                  <TableRow key={item.id}>
                    <TableCell
                      className="px-5 py-3
font-medium text-gray-500 text-start text-theme-xs
dark:text-gray-400"
                    >
                      <Checkbox
                        className="w-5 h-5"
                        checked={selectedRoomTypes.includes(item.id!)}
                        onChange={() => handleCheckboxChange(item.id!)}
                      />
                    </TableCell>

                    <TableCell
                      className="px-4 py-3
text-gray-500 text-start text-theme-sm
dark:text-gray-400"
                    >
                      <div className="w-[150px]">{item.name}</div>
                    </TableCell>
                    <TableCell
                      className="px-5 py-4
sm:px-6 text-center"
                    >
                      <div className="w-[400px]">
                        <RoomTypeSlider
                          images={item?.Images!}
                          name={item.name!}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="w-[250px]">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {item.name}
                        </span>

                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400 ">
                          {item.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {item?.pricePerNight?.toLocaleString("vi-VN", {
                            style: "decimal",
                            minimumFractionDigits: 3,
                            maximumFractionDigits: 3,
                          })}{" "}
                          VNĐ
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex flex-col w-[150px]">
                        <div className="border-b-1 p-2">
                          Giường đôi:
                          <Badge color="error">{item.doubleBed}</Badge>
                        </div>

                        <div className="border-b-1 p-2">
                          Giường đơn:
                          <Badge color="info">{item.singleBed}</Badge>
                        </div>

                        <div className="border-b-1 p-2">
                          Diện tích:
                          <Badge color="warning">{item.sizes}m2</Badge>
                        </div>

                        <div className="p-2">
                          Số lượng người:
                          <Badge color="primary">{item.capacity}</Badge>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3 w-2 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <RoomTypeActionDropdown
                        id={item.id!}
                        onReload={onReload}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
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

export default RoomTypesTable;
