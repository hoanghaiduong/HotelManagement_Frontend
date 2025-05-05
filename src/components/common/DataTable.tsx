import React, { useEffect, useState } from "react";
import { PaginationModel } from "../../common/types/PaginationModel";
import axiosInstance from "../../common/configs/axiosInstance";
import Swal from "sweetalert2";
import Label from "../form/Label";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import TableControls from "./TableControls";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Checkbox from "../form/input/Checkbox";
import Pagination from "./Pagination";
interface DataTableProps<T> {
  title?: string;
  endpoint: string;
  columns: {
    header: string;
    width?: number;
    render: (item: T) => React.ReactNode;
  }[];
  actions?: (item: T) => React.ReactNode;
  onSelectItem?: (item: T | null) => void;
  reload: number;
  onReload: () => void;
}
function DataTable<T extends { id: number }>({
  endpoint,
  columns,
  actions,
  onSelectItem,
  reload,
  onReload,
}: DataTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Thêm trạng thái lỗi;
  const [pagination, setPagination] = useState({
    PageSize: 10,
    PageNumber: 1,
    Depth: 0,
    Search: "",
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [option, setOption] = useState("");
  const options = [
    { value: "delete", label: "Xoá" },
    { value: "add", label: "Thêm" },
  ];
  const debounce = (func: Function, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };
  const fetchData = async () => {
    setLoading(true);
    setError(null); // Đặt lại lỗi trước khi gọi API

    try {
      const params: PaginationModel = {
        PageNumber: pagination.PageNumber,
        PageSize: pagination.PageSize,
        Depth: pagination.Depth,
      };
      if (pagination.Search) {
        params.Search = pagination.Search;
      }
      const response = await axiosInstance.get(endpoint, {
        params: params,
      });
      const { items, totalPages, totalCount } = response.data;
      setData(items);
      setTotalPages(totalPages);
      setTotalCount(totalCount);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra"); // Lưu thông báo lỗi
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [reload, pagination]);
  useEffect(() => {
    setSelectedIds([]);
  }, [data]);
  const handleCheckbox = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    const selected = data.find((x) => x.id === id);
    onSelectItem?.(selected || null);
  };
  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? data.map((d) => d.id) : []);
  };
  const handleSearchChange = debounce((value: string) => {
    setPagination((prev) => ({ ...prev, Search: value, PageNumber: 1 }));
  }, 500);
  const handlePageChange = debounce((value: number) => {
    setPagination((prev) => ({ ...prev, PageNumber: value }));
  }, 100);
  const handleEntriesChange = debounce((value: number) => {
    setPagination((prev) => ({ ...prev, PageSize: value, PageNumber: 1 }));
  }, 100);
  const handleAction = async () => {
    if (option === "delete" && selectedIds.length > 0) {
      try {
        const res = await axiosInstance.delete(`${endpoint}/ids`, {
          data: selectedIds,
        });
        Swal.fire("Thành công", res.data.message, "success").then(onReload);
      } catch (e: any) {
        Swal.fire(
          "Thất bại",
          e?.response?.data?.message || "Có lỗi xảy ra",
          "error"
        );
      }
    } else if (option === "add") {
      alert("Thêm mới");
    }
  };
  return (
    <div>
      <div
        className="overflow-hidden rounded-xl border border-gray-200
    bg-white dark:border-white/[0.05] dark:bg-white/[0.03]"
      >
        <div className="max-w-full overflow-x-auto">
          <div className="space-y-4">
            <div
              className="mx-4 mt-2 mb-2 flex flex-col xsm:flex
    xsm:justify-around xsm:items-center xsm:flex-row"
            >
              <Label className="mr-4 mt-2.5 mb-1.5">Chọn hành động</Label>
              <Select
                className="dark:bg-dark-900 flex-1 mt-2.5 mb-1.5"
                options={options}
                onChange={setOption}
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
            <TableControls
              onSearchChange={handleSearchChange}
              onEntriesChange={handleEntriesChange}
              containerStyle="py-0 px-4"
            />
          </div>
          <Table>
            <TableHeader
              className="border-b border-gray-100
    dark:border-white/[0.05]"
            >
              <TableRow
                className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr]
    items-center"
              >
                <TableCell
                  isHeader
                  className="px-4 py-3 font-medium text-gray-500 text-start
    
    text-theme-xs dark:text-gray-400"
                >
                  <Checkbox
                    checked={selectedIds.length === data.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                {columns.map((col, idx) => (
                  <TableCell
                    isHeader
                    className="px-3 py-2 font-medium text-gray-500 text-start
    
    text-theme-xs dark:text-gray-400"
                    key={idx}
                  >
                    {col.header}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell
                    isHeader
                    className="px-3 py-2 font-medium text-gray-500 text-start
    
    text-theme-xs dark:text-gray-400"
                  >
                    Thao tác
                  </TableCell>
                )}
              </TableRow>
            </TableHeader>
            <TableBody
              className="divide-y divide-gray-100
    dark:divide-white/[0.05] dark:text-white"
            >
              {error ? (
                <TableRow>
                  <TableCell className="text-center py-4 w-full text-red-500">
                    {error}
                  </TableCell>
                </TableRow>
              ) : loading ? (
                <TableRow>
                  <TableCell className="text-center py-4 w-full">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : data.length > 0 ? (
                data.map((item) => (
                  <TableRow
                    className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr]
    
    items-center"
                    key={item.id}
                  >
                    <TableCell
                      className="px-4 py-3 text-gray-500 text-start
    
    text-theme-sm dark:text-gray-400"
                    >
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleCheckbox(item.id)}
                      />
                    </TableCell>
                    {columns.map((col, idx) => (
                      <TableCell
                        key={idx}
                        className="px-4 py-3 text-gray-500 text-start
    
    text-theme-sm dark:text-gray-400"
                      >
                        {col.render(item)}
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell
                        className="px-4 py-3 w-2 text-gray-500 text-start
    
    text-theme-sm dark:text-gray-400"
                      >
                        {actions(item)}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="text-center py-4 w-full">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Pagination
        currentPage={pagination.PageNumber}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
export default DataTable;
