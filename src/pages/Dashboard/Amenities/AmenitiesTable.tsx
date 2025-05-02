import React, { useEffect, useState } from "react";
import { Amenities } from "../../../common/types/IAmenities";
import { PaginationModel } from "../../../common/types/PaginationModel";
import axiosInstance from "../../../common/configs/axiosInstance";
import Swal from "sweetalert2";
import Pagination from "../../../components/common/Pagination";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import Button from "../../../components/ui/button/Button";
import TableControls from "../../../components/common/TableControls";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import Checkbox from "../../../components/form/input/Checkbox";

interface AmenitiesTableProps {
  reload: number;
  onReload: () => void;
  onSelectAmenity: (amenity: Amenities) => void;
}

const AmenitiesTable: React.FC<AmenitiesTableProps> = ({
  reload,
  onReload,
  onSelectAmenity,
}) => {
  const [amenities, setAmenities] = useState<Amenities[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationModel>({
    PageSize: 10,
    PageNumber: 1,
    Depth: 0,
    Search: "",
  });
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const options = [
    { value: "delete", label: "Xoá" },
    { value: "add", label: "Thêm" },
  ];
  const [option, setSelectOption] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Chọn tất cả: lấy tất cả ID từ list
      setSelectedIds(amenities.map((amentity) => amentity.id!));
    } else {
      // Bỏ chọn tất cả: đặt lại mảng rỗng
      setSelectedIds([]);
    }
  };
  // Xử lý khi checkbox thay đổi
  const handleCheckboxChange = (amenityId: number) => {
    setSelectedIds(
      (prevSelected) =>
        prevSelected.includes(amenityId)
          ? prevSelected.filter((id) => id !== amenityId) // Bỏ chọn
          : [...prevSelected, amenityId] // Chọn thêm
    );

    const selected = amenities.find((x) => x.id === amenityId);
    if (selected) {
      onSelectAmenity(selected);
    }
  };

  const handleSelectChange = (value: string) => {
    setSelectOption(value);
  };
  const handleSearchChange = debounce((value: string) => {
    setPagination((prev) => ({ ...prev, Search: value, PageNumber: 1 }));
  }, 500);

  const handleEntriesChange = debounce((value: number) => {
    setPagination((prev) => ({ ...prev, PageSize: value, PageNumber: 1 }));
  }, 100);
  const handlePageChange = debounce((value: number) => {
    setPagination((prev) => ({ ...prev, PageNumber: value }));
  }, 100);
  const handleAction = async () => {
    if (option === "add") {
      alert("Thêm mới tiện ích");
    } else if (option === "delete") {
      if (selectedIds.length > 0) {
        let response;
        try {
          response = await axiosInstance.delete("/Amenitie/ids", {
            data: selectedIds,
          });
          if (response.status === 200) {
            Swal.fire({
              title: "Successfully",
              text: response?.data?.message,
              icon: "success",
            }).then(() => {
              setSelectedIds([]);
              onReload();
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Failed",
            text: response?.data?.message,
            icon: "error",
          });
        }
      }
    }
  };
  useEffect(() => {
    const getAmenities = async () => {
      setLoading(true);
      try {
        const params: PaginationModel = {
          PageNumber: pagination.PageNumber,
          PageSize: pagination.PageSize,
          Depth: pagination.Depth,
          Search: pagination.Search,
        };

        const response = await axiosInstance.get("/Amenitie", { params });

        if (response.status === 200) {
          const { items, totalCount, totalPages } = response.data;
          setAmenities(items);
          setTotalCount(totalCount);
          setTotalPages(totalPages);
        }
      } catch (error) {
        console.error("Error fetching amenities:", error);
      } finally {
        setLoading(false);
      }
    };

    getAmenities();
  }, [reload, pagination]);
  useEffect(() => {
    setSelectedIds([]);
  }, [amenities]);
  return (
    <div>
      <div
        className="overflow-hidden rounded-xl
  border border-gray-200 bg-white
  dark:border-white/[0.05] dark:bg-white/[0.03]"
      >
        <div className="max-w-full overflow-x-auto">
          <div className="space-y-4">
            <div
              className="mx-4 mt-2 mb-2 flex
  flex-col xsm:flex xsm:justify-around xsm:items-center
  xsm:flex-row"
            >
              <Label
                className="mr-4 mt-2.5
  mb-1.5"
              >
                Chọn hành động
              </Label>
              <Select
                options={options}
                placeholder="Select Option"
                onChange={handleSelectChange}
                className="dark:bg-dark-900 flex-1
  mt-2.5 mb-1.5"
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
                onClick={onReload}
                size="sm"
                className="xsm:ml-2 mt-2.5 mb-1.5"
                variant="outline"
              >
                Làm mới
              </Button>
            </div>

            <TableControls
              containerStyle="py-0 px-4"
              onSearchChange={handleSearchChange}
              onEntriesChange={handleEntriesChange}
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
                  className="px-4 py-3 font-medium
  text-gray-500 text-start text-theme-xs
  dark:text-gray-400"
                >
                  <Checkbox
                    onChange={handleSelectAll}
                    checked={
                      amenities.length > 0 &&
                      selectedIds.length === amenities.length
                    }
                  />
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-2 font-medium
  text-gray-500 text-start text-theme-xs
  dark:text-gray-400"
                >
                  Tên tiện ích
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-2 font-medium
  text-gray-500 text-start text-theme-xs
  dark:text-gray-400"
                >
                  Icon
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
                  Thời gian tạo
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell className="text-center py-4">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : amenities.length > 0 ? (
                amenities.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell
                      className="px-4 py-3
  text-gray-500 text-start text-theme-sm
  dark:text-gray-400"
                    >
                      <Checkbox
                        checked={selectedIds.includes(item.id!)}
                        onChange={() => handleCheckboxChange(item.id)}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-3text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {item.name}
                    </TableCell>

                    <TableCell
                      className="px-4 py-3
  text-gray-500 text-start text-theme-sm
  dark:text-gray-400"
                    >
                      <i className={item.icon}></i>
                      {""}
                      {/* icon dạng class font-awesome
                       */}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3
  text-gray-500 text-start text-theme-sm
  dark:text-gray-400"
                    >
                      {item.description || "Không có mô tả"}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3
  text-gray-500 text-start text-theme-sm
  dark:text-gray-400"
                    >
                      {new Date(item.createdAt).toLocaleString("vi-VN")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    className="text-center
  py-4"
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Pagination
        currentPage={pagination.PageNumber!}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AmenitiesTable;
