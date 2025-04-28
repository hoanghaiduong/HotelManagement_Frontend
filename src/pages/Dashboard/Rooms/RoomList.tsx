import React, { useEffect, useState } from "react";
import { Room, RoomFilter } from "../../../common/types/Room";
import { PaginationModel } from "../../../common/types/PaginationModel";
import { useModal } from "../../../hooks/useModal";
import axiosInstance from "../../../common/configs/axiosInstance";
import ComponentCard from "../../../components/common/ComponentCard";
import Checkbox from "../../../components/form/input/Checkbox";
import RoomModalAddOrEdit from "./RoomModalAddOrEdit";
interface RoomListProps {
  filters: RoomFilter;
}
const RoomList: React.FC<RoomListProps> = ({ filters }) => {
  const [pagination, setPagination] = useState<PaginationModel>({
    PageNumber: 1,
    PageSize: 50,
    Depth: 1,
    Search: "",
  });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [modalType, setModalType] = useState<
    "Booking" | "RoomAddOrEdit" | null
  >(null);
  const [reload, setReload] = useState<number>(0);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);

  const triggerReload = () => {
    setReload((prev) => prev + 1);
  };

  useEffect(() => {
    const getRooms = async () => {
      const params: PaginationModel | any = {
        PageNumber: pagination.PageNumber,
        PageSize: pagination.PageSize,
        Depth: pagination.Depth,
      };
      if (pagination.Search) {
        params.Search = pagination.Search;
      }
      if (filters.status) {
        if (filters.status === "ALL") {
          params.Status = null;
          delete params.CleanStatus;
          delete params.IsDoubleBed;
          delete params.IsSignleBed;
        } else {
          params.Status = filters.status;
        }
      }

      if (filters.cleanStatus) {
        if (filters.cleanStatus === "ALL") {
          params.CleanStatus = null;
        } else params.CleanStatus = filters.cleanStatus;
      }
      // Thêm điều kiện lọc cho loại phòng
      if (filters.roomType) {
        if (filters.roomType === "singleBed") {
          params.IsSingleBed = true; // Lọc giường đơn
          delete params.IsDoubleBed; // Nếu lọc giường đơn thì không cần giường đôi
        } else if (filters.roomType === "doubleBed") {
          params.IsDoubleBed = true; // Lọc giường đôi
          delete params.IsSingleBed; // Nếu lọc giường đôi thì không cần giường đơn
        } else if (filters.roomType === "singleAndDouble") {
          params.IsSingleBed = true; // Lọc giường đơn
          params.IsDoubleBed = true; // Lọc giường đôi
        } else if (filters.roomType === "ALL") {
          // Nếu chọn "Tất cả loại phòng", không cần tham số lọc nào
          delete params.IsSingleBed;
          delete params.IsDoubleBed;
          delete params.IsFamily;
        }
      }

      const response = await axiosInstance.get("/Room", { params });
      setRooms(response?.data?.items);
    };

    getRooms();
  }, [reload, filters, pagination]);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Empty":
        return "green";
      case "Booked":
        return "amber";
      case "Rented":
        return "yellow";
      default:
        return "gray";
    }
  };
  const handleClick = (room: Room) => {
    if (room.status !== "Booked" && room.status !== "Rented") {
      setSelectedRoom(room);
      setModalType("Booking");
      openModal();
    }
  };
  const handleAddOrEdit = (room?: Room) => {
    setSelectedRoom(room || null);
    setModalType("RoomAddOrEdit");
    openModal();
  };
  const handleModalClose = () => {
    setModalType(null);
    setSelectedRoom(null);
    closeModal();
  };
  // Xử lý khi checkbox thay đổi
  const handleCheckboxChange = (roomId: number) => {
    setSelectedRooms(
      (prevSelected) =>
        prevSelected.includes(roomId)
          ? prevSelected.filter((id) => id !== roomId)
          : // Bỏ chọn
            [...prevSelected, roomId] // Chọn thêm
    );
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12">
        <div
          className="flex justify-between
 items-center"
        >
          <div className="text-lg font-semibold dark:text-white">Danh sách phòng</div>
          <button
            className="flex items-center
 justify-center p-3 font-medium text-white rounded-lg
 bg-brand-500 text-theme-sm hover:bg-brand-600"
            onClick={() => handleAddOrEdit()}
          >
            Thêm mới
          </button>
        </div>
      </div>
      {rooms.length > 0 ? (
        rooms.map((room: Room) => (
          <ComponentCard
            key={room.id}
            title={room.roomNumber}
            className={`col-span-12 lg:col-span-3
 md:col-span-4 xsm:col-span-6 hover:shadow-xl
 transition-all duration-300 cursor-pointer border-2
 border-dotted
  border-${getStatusBadge(room.status)}-500
 shadow-${getStatusBadge(room.status)}-500
  `}
            left={
              <Checkbox
                checked={selectedRooms.includes(room.id!)}
                onChange={() => handleCheckboxChange(room.id!)}
              />
            }
            right={
              <button className="dark:text-white" onClick={() => handleAddOrEdit(room)}>
                <i className="fas fa-edit " />
              </button>
            }
          >
            <div onClick={() => handleClick(room)}>
              <div
                className="text-sm mt-1
 text-gray-700"
              >
                {room.status}
              </div>
              <div
                className="text-xs mt-2
 text-gray-600"
              >
                {room.roomTypeName}
              </div>
              <div
                className="text-xs mt-1
 text-gray-500"
              >
                Tầng: {room.floor}
              </div>
              <div
                className="text-xs mt-1
 text-gray-500"
              >
                Tình trạng dọn: {room.cleanStatus}
              </div>
            </div>
          </ComponentCard>
        ))
      ) : (
        <div
          className="col-span-12 text-center
 text-gray-500"
        >
          Không có phòng nào
        </div>
      )}
      {/* {modalType === "Booking" && selectedRoom &&
 (
  <BookingModal
  isOpen={isOpen}
  closeModal={handleModalClose}
  room={selectedRoom}
  />
  )} */}
      {modalType === "RoomAddOrEdit" && (
        <RoomModalAddOrEdit
          isOpen={isOpen}
          closeModal={handleModalClose}
          room={selectedRoom!}
          onReload={triggerReload}
        />
      )}
    </div>
  );
};

export default RoomList;
