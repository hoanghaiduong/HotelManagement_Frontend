import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { RoomType } from "../../../common/types/RoomType";
import axiosInstance from "../../../common/configs/axiosInstance";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Constants from "../../../common/configs/Constants";
import { Swiper, SwiperSlide } from "swiper/react";
import { Room } from "../../../common/types/Room";

const SingleRoomType: React.FC = () => {
  const { id } = useParams();
  const [roomType, setRoomType] = useState<RoomType | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const getData = async () => {
      const response = await axiosInstance.get(`/RoomType/${id}?Depth=2`);
      setRoomType(response.data);
    };
    getData();
  }, [id]);
  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <>
      <PageMeta title="Chi tiết phòng" description="Chi tiết phòng" />
      <PageBreadcrumb
        pageTitle="Danh sách loại phòng"
        subPage="Chi tiết loại phòng"
      />

      <div className="flex gap-3 justify-between">
        <button
          onClick={handleGoBack}
          className="flex items-center justify-center
  p-3 font-medium text-gray-500 dark:text-white
  rounded-lg border border-gray-300
  hover:border-blue-600 hover:text-blue-600
  text-theme-sm dark:hover:bg-brand-600"
        >
          <i
            className="fa-solid fa-arrow-left
  mr-4"
          ></i>
          Quay về
        </button>
        <Link to={`/roomType/edit/${id}`}>
          <button
            className="flex items-center
  justify-center p-3 font-medium text-white rounded-lg
  bg-brand-500 text-theme-sm hover:bg-brand-600"
          >
            <i
              className="fa-regular fa-pen-to-square
  mr-4"
            ></i>
            Chỉnh sửa
          </button>
        </Link>
      </div>
      <div className="space-y-6">
        <div
          className="mt-6 grid grid-cols-1
  lg:grid-cols-3 gap-6"
        >
          {/* Cột trái: ảnh + gallery (chiếm 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <ComponentCard
              title={`${roomType?.name}`}
              titleStyle="!text-xl !font-bold"
              isImage={true}
            >
              {/* Ảnh đại diện với overlay */}
              <div
                className="relative w-full
  h-[600px] rounded-bl-2xl rounded-br-2xl
  overflow-hidden shadow-lg"
              >
                <img
                  className="w-full h-full
  object-cover"
                  src={`${Constants.BASE_URL_BACKEND}/${roomType?.thumbnail}`}
                  alt={roomType?.name}
                />
                <div
                  className="absolute inset-0
  bg-black/40 flex flex-col justify-end p-6 text-white"
                >
                  <h2
                    className="text-2xl
  font-bold"
                  >
                    {roomType?.name}
                  </h2>
                  <p className="mt-2">{roomType?.description}</p>
                </div>
              </div>
            </ComponentCard>
            <ComponentCard
              title="Hình ảnh khác"
              titleStyle="!text-xl !font-bold"
            >
              {/* Gallery ảnh */}
              {roomType?.Images?.length > 0 && (
                <div>
                  <Swiper slidesPerView={2} spaceBetween={10}>
                    {roomType?.Images?.map((img: string, idx: number) => (
                      <SwiperSlide key={idx}>
                        <img
                          className="rounded-xl w-full
  h-[300px] object-cover"
                          src={`${Constants.BASE_URL_BACKEND}/${img}`}
                          alt={`img-${idx}`}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
            </ComponentCard>
          </div>

          {/* Cột phải: thông tin chi tiết */}
          <div className="space-y-4">
            <ComponentCard
              title="Thông tin cơ bản"
              titleStyle="!text-xl !font-bold"
            >
              <div>
                <h4
                  className="font-semibold text-gray-700 dark:text-white/90"
                >
                  Sức chứa:
                </h4>
                <p
                  className="dark:text-white/90 text-gray-600"
                >
                  {roomType?.capacity} người
                </p>
              </div>
              <div>
                <h4
                  className="font-semibold text-gray-700 dark:text-white/90"
                >
                  Giá mỗi đêm:
                </h4>
                <p
                  className="dark:text-white/90 text-gray-600"
                >
                  {roomType?.pricePerNight?.toLocaleString()} VND
                </p>
              </div>

              <div>
                <h4
                  className="font-semibold
  text-gray-700 dark:text-white/90"
                >
                  Diện tích:
                </h4>
                <p
                  className="dark:text-white/90
  text-gray-600"
                >
                  {roomType?.sizes} m2
                </p>
              </div>
              <div>
                <h4
                  className="font-semibold
  text-gray-700 dark:text-white/90"
                >
                  Tiện nghi:
                </h4>
                <div
                  className="text-lg
  dark:text-white/90 text-gray-600 space-y-2 mt-2"
                >
                  {roomType?.amenities?.map(
                    (f: { icon: string; name: string }, idx: number) => (
                      <div
                        key={idx}
                        className="flex
  items-center gap-x-3"
                      >
                        <div
                          className="w-9 h-9 flex
  items-center justify-center bg-gray-100 rounded-md"
                        >
                          <i
                            className={`${f.icon}
  text-xl text-gray-600`}
                          />
                        </div>

                        <span>{f.name}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </ComponentCard>
            <ComponentCard title="Danh sách phòng">
              {roomType?.rooms?.length > 0 && (
                <div className="">
                  <div className="grid grid-cols-2 xsm:grid-cols-2 md:grid-cols-3 gap-4">
                    {roomType?.rooms?.map((room: Room, idx: number) => (
                      <div
                        key={room.id}
                        className={`p-4 rounded-xl text-center shadow-md cursor-pointer transition-all ${
                          room.status === "Ready"
                            ? "border border-green-500 hover:bg-green-200 text-green-800"
                            : room.status === "Booked"
                            ? "border border-gray-500 text-gray-600 cursor-not-allowed"
                            : room.status === "Not_Available"
                            ? "border border-red-500 text-red-600 cursor-not-allowed"
                            : "bg-yellow-200 text-gray-600 cursor-not-allowed"
                        }`}
                      >
                        <div
                          className="font-bold
  text-lg"
                        >
                          {room.roomNumber}
                        </div>

                        <div className="text-sm">
                          Tầng:
                          {room.floor}
                        </div>
                        <div
                          className="text-xs mt-1
  
  italic"
                        >
                          {room.status === "Ready"
                            ? "Sẵn sàng"
                            : room.status === "Booked"
                            ? "Đang sử dụng"
                            : room.status === "Not_Available"
                            ? "Không có sẵn"
                            : "Sửa chữa"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ComponentCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleRoomType;
