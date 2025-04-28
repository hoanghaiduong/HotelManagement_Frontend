import React, { useState } from "react";
import { IOption } from "../../../common/types/IOption";
import Label from "../../../components/form/Label";
import Radio from "../../../components/form/input/Radio";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import Input from "../../../components/form/input/InputField";
import DatePicker from "../../../components/form/date-picker";
import { TimeIcon } from "../../../icons";
import RoomList from "./RoomList";

const statusOptions: IOption[] = [
  { label: "Phòng trống", value: "Empty" },
  { label: "Phòng đã đặt", value: "Booked" },
  { label: "Phòng đang thuê", value: "Rented" },
  { label: "Tất cả phòng", value: "ALL" },
];
const roomTypeOptions: IOption[] = [
  { label: "Giường đơn", value: "singleBed" },
  { label: "Giường đôi", value: "doubleBed" },
  { label: "Giường đôi & đơn", value: "singleAndDouble" },
  { label: "Tất cả loại phòng", value: "ALL" },
];
const statusRoomOptions: IOption[] = [
  { label: "Đã dọn dẹp", value: "Ready" },
  { label: "Đang sửa chữa", value: "Maintenance" },
  { label: "Chưa dọn dẹp", value: "Not_Cleaned" },
  { label: "Tất cả", value: "ALL" },
];
const FilterSection = ({
  title,
  options,
  name,
  selectedValue,
  onChange,
}: {
  title: string;
  options: IOption[];
  name: string;
  selectedValue: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="mb-6">
      <Label>{title}</Label>
      {options.map((item, idx) => (
        <Radio
          key={idx}
          id={`${name}-${item.value}`}
          name={name}
          value={item.value}
          checked={selectedValue === item.value}
          onChange={onChange}
          label={item.label}
          className="my-2"
        />
      ))}
    </div>
  );
};
const RoomManager = () => {
  const [filters, setFilters] = useState({
    status: "ALL",
    roomType: "ALL",
    cleanStatus: "ALL",
  });
  const handleFilterChange = (
    key: "status" | "roomType" | "cleanStatus",
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  return (
    <div>
      <PageMeta title="Quản Lý Phòng" description="Quản Lý Phòng" />
      <PageBreadcrumb pageTitle="Quản Lý Phòng" />
      <div className="">
        <div className="grid grid-cols-12 gap-4 mt-4">
          {/* Danh sách phòng */}
          <div
            className="col-span-12 bg-white
 dark:bg-white/[0.03] p-4 rounded-xl shadow
 lg:col-span-9"
          >
            <RoomList filters={filters} />
          </div>
          {/* Bộ lọc */}
          <div
            className="col-span-12 bg-white
 dark:bg-white/[0.03] p-4 rounded-xl shadow w-full
 lg:col-span-3"
          >
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <div
                  className="absolute left-4
 top-1/2 -translate-y-1/2 pointer-events-none z-99"
                >
                  <svg
                    className="fill-gray-500
 dark:fill-gray-400 "
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                    />
                  </svg>
                </div>
                <Input
                  type="text"
                  id="search"
                  placeholder="Tìm kiếm..."
                  className="pl-12"
                />
              </div>
            </div>
            {/* Date picker */}
            <div
              className="flex flex-col xl:flex-row
 items-center gap-3 mb-6"
            >
              <div className="w-full">
                <DatePicker
                  id="date-picker"
                  label="Chọn ngày"
                  placeholder="Chọn ngày"
                  onChange={(dates, currentDateString) =>
                    console.log(dates, currentDateString)
                  }
                />
              </div>
              <div className="w-full">
                <Label>Chọn thời gian</Label>
                <div className="relative">
                  <Input type="time" id="time" name="time" />
                  <span
                    className="absolute right-3
 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    <TimeIcon className="size-6" />
                  </span>
                </div>
              </div>
            </div>
            {/* Bộ lọc Radio */}
            <FilterSection
              title="Trạng thái phòng"
              options={statusOptions}
              name="status"
              selectedValue={filters.status}
              onChange={(value) => handleFilterChange("status", value)}
            />
            <FilterSection
              title="Loại phòng"
              options={roomTypeOptions}
              name="roomType"
              selectedValue={filters.roomType}
              onChange={(value) => handleFilterChange("roomType", value)}
            />
            <FilterSection
              title="Tình trạng phòng"
              options={statusRoomOptions}
              name="cleanStatus"
              selectedValue={filters.cleanStatus}
              onChange={(value) => handleFilterChange("cleanStatus", value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomManager;
