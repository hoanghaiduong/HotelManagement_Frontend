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

const UserManager = () => {
  const dispatch = useAppDispatch();
  const [reload, setReload] = useState<number>(0);
  const { data, loading, error } = useAppSelector((state) => state.users);
  const handleOnReload = () => {
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

  //2.43
  const [entries, setEntries] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    dispatch(
      fetchUsers({
        PageNumber: currentPage,
        PageSize: pageSize,
        Depth: 1,
        Search: searchTerm,
      })
    );
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
          right={<Button>Thêm mới</Button>}
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

          <div className="flex justify-between items-center">
            {/* Select entries */}
            <div className="flex items-center space-x-2">
              <span
                className="text-sm text-gray-700
dark:text-gray-300"
              >
                Show
              </span>
              <div className="relative">
                <select
                  value={entries}
                  onChange={() => {}}
                  className="appearance-none border border-gray-300 cursor-pointer dark:border-white/10 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-white pr-6 focus:outline-none focus:ring-0 focus:border-gray-400"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <ChevronDownIcon
                  className="absolute right-2 top-1/2
-translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                entries
              </span>
            </div>

            <div>
              <div className="relative">
                <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                  <svg
                    className="fill-gray-500 dark:fill-gray-400"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                      fill=""
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search or type command..."
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                />

                <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                  <span> ⌘ </span>
                  <span> K </span>
                </button>
              </div>
            </div>
          </div>
          <UserTables users={data.items} onRefresh={handleOnReload} />
          {/*Có thể dùng table khác ở đây*/}
          <Pagination
            currentPage={currentPage}
            onPageChange={() => {}}
            totalCount={totalCount}
            totalPages={totalPages}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default UserManager;
