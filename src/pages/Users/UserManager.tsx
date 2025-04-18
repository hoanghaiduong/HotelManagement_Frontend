import React, { useCallback, useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import UserTables from "./tables/UserTables";
import Button from "../../components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { fetchUsers } from "../../redux/slices/user/UserThunk";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import { ChevronDownIcon } from "../../icons";
import Pagination from "../../components/common/Pagination";
import { useModal } from "../../hooks/useModal";
import UserModalAddOrEdit from "./UserModalAddOrEdit";
import TableControls from "../../components/common/TableControls";

const UserManager = () => {
  const dispatch = useAppDispatch();
  const { openModal, isOpen, closeModal } = useModal();
  const [reload, setReload] = useState<number>(0);
  const { data, loading, error } = useAppSelector((state) => state.users);

  // Callback được truyền xuống modal khi lưu thành công
  const handleRefresh = useCallback(() => {
    // tăng giá trị reload để trigger useEffect trong UsersTable
    setReload((prev) => prev + 1);
  }, []);
  const handleModalClose = () => {
    closeModal();
    //reload
    setReload((prev) => prev + 1);
  };

  const options = [
    { value: "add", label: "Thêm" },
    { value: "remove", label: "Xoá" },
  ];
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  // // Hàm debounce để trì hoãn tìm kiếm
  // const debounce = (func: Function, delay: number) => {
  //   let timeoutId: NodeJS.Timeout;
  //   return (...args: any[]) => {
  //     clearTimeout(timeoutId);
  //     timeoutId = setTimeout(() => func(...args), delay);
  //   };
  // };
  const [searchTerm, setSearchTerm] = useState<string>(""); // Dùng cho input
  const [debouncedSearch, setDebouncedSearch] = useState<string>(""); // Dùng gọi API

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer); // cleanup
  }, [searchTerm]);

  useEffect(() => {
    dispatch(
      fetchUsers({
        PageNumber: currentPage,
        PageSize: pageSize,
        Depth: 1,
        Search: debouncedSearch,
      })
    );
    if (data) {
    
      setTotalPages(data?.totalPages!);
      setTotalCount(data?.totalCount!);
    }
  }, [currentPage, pageSize, debouncedSearch, reload]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);
  
  if (loading) {
    return <p>Loading...</p>;
  } else if (error) {
    return <p>Error {error}</p>;
  }
  return (
    <>
      <PageMeta
        title="Quản lý người dùng"
        description="Đây là trang hiển thị danh sách người dùng của hệ thống!"
      />
      <PageBreadcrumb pageTitle="Danh sách người dùng" />
      <div className="space-y-6">
        <ComponentCard
          title="Danh sách người dùng"
          right={<Button onClick={openModal}>Thêm mới</Button>}
        >
          <div className="flex items-center gap-x-3 gap-y-0">
            <div className="flex items-center">
              <Label className="mr-4">Chọn hành động</Label>
              <Select
                options={options}
                placeholder="Select Option"
                onChange={() => {}}
                className="dark:bg-dark-900 flex-1"
              />
            </div>
            <div>
              <Button size="sm" variant="primary">
                Thực hiện
              </Button>
            </div>
            <div>
              <Button size="sm" variant="outline">
                Làm mới
              </Button>
            </div>
          </div>

          <TableControls
            searchValue={searchTerm}
            onSearchChange={handleSearchChange} // cập nhật input ngay
            onEntriesChange={(value) => {
              setPageSize(value);
              setCurrentPage(1);
            }}
          />
          {loading ? (
            <div className="text-center py-10">Đang tải dữ liệu...</div>
          ) : (
            <UserTables users={data.items} onRefresh={handleRefresh} />
          )}
        
          <Pagination
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
            totalCount={totalCount}
            totalPages={totalPages}
          />
        </ComponentCard>
      </div>
      {isOpen && (
        <UserModalAddOrEdit
          isOpen={isOpen}
          closeModal={handleModalClose}
          onRefresh={handleRefresh}
        />
      )}
    </>
  );
};

export default UserManager;
