import React, { useEffect, useState } from "react";
import { Room } from "../../../common/types/Room";
import { IOption } from "../../../common/types/IOption";
import axiosInstance from "../../../common/configs/axiosInstance";
import { RoomType } from "../../../common/types/RoomType";
import * as Yup from "yup";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { Modal } from "../../../components/ui/modal";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import Button from "../../../components/ui/button/Button";
interface RoomModalProps {
  room?: Room;
  isOpen: boolean;
  closeModal: () => void;
  onReload: () => void;
}
const RoomModalAddOrEdit: React.FC<RoomModalProps> = ({
  closeModal,
  isOpen,
  onReload,
  room,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false); // quản lý loading state
  const [roomTypeOptions, setRoomTypeOptions] = useState<IOption[]>([]);
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await axiosInstance.get(
          "/RoomType?PageNumber=1&PageSize=50&Depth=0"
        );
        if (response.status === 200) {
          const items = response?.data?.items;
          const options: IOption[] = items?.map((item: RoomType) => ({
            value: item.id?.toString(),
            label: item.name,
          }));
          setRoomTypeOptions(options);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoomTypes();
  }, []);
  const statusOptions = [
    { value: "Empty", label: "Phòng trống" },
    { value: "Booked", label: "Đã đặt" },
    { value: "Rented", label: "Đang có người thuê" },
  ];
  const cleanStatusOptions = [
    { value: "Ready", label: "Sẵn sàng" },
    { value: "Maintenance", label: "Đang sửa chữa" },
    { value: "Not_Cleaned", label: "Chưa dọn dẹp" },
  ];
  const validationSchema = Yup.object({
    roomNumber: Yup.string().required("Số phòng là bắt buộc"),
    floor: Yup.number()
      .required("Tầng là bắt buộc")
      .min(1, "Tầng phải lớn hơn 0"),
    status: Yup.string().required("Trạng thái phòng là bắt buộc"),
    cleanStatus: Yup.string().required("Trạng thái vệ sinh là bắt buộc"),
    roomTypeId: Yup.string().required("Loại phòng là bắt buộc"),
  });
  const formik = useFormik({
    initialValues: {
      roomNumber: room?.roomNumber || "",
      floor: room?.floor || 1,
      status: room?.status || "Empty",
      cleanStatus: room?.cleanStatus || "Ready",
      roomTypeId: room?.roomTypeId?.toString() || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true); // bật loading
        let response;
        if (room) {
          console.log("Sửa phòng với id:", room.id);
          console.log("Dữ liệu cần sửa:", values);
          response = await axiosInstance.put(`/Room/${room.id}`, values);
        } else {
          response = await axiosInstance.post("/Room", values);
        }
        if (response.status === 200) {
          Swal.fire({
            title: "Thành công!",
            text: room ? "Cập nhật phòng thành công" : "Thêm phòng thành công",
            icon: "success",
            customClass: {
              container: "swal-container",
            },
          }).then((result) => {
            if (result.isConfirmed) {
              onReload();
              closeModal();
            }
          });
        }
      } catch (error: any) {
        console.error("Gặp lỗi:", error);
        Swal.fire({
          title: "BAD REQUEST",
          text: error?.message,
          icon: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
      <div
        className="relative w-full max-w-[700px]
  overflow-y-auto rounded-3xl bg-white p-4
  dark:bg-gray-900 lg:p-11"
      >
        <div className="px-2 pr-14">
          <h4
            className="mb-2 text-2xl font-semibold
  text-gray-800 dark:text-white/90"
          >
            {room
              ? `Sửa thông tin phòng
  ${room?.roomNumber}`
              : "Tạo phòng mới"}
          </h4>
          <p
            className="mb-6 text-sm text-gray-500
  dark:text-gray-400 lg:mb-7"
          >
            {room ? "Điền thông tin phòng cần sửa." : "Điền thông tin phòng."}
          </p>
        </div>
        <form onSubmit={formik.handleSubmit} className="flex flex-col">
          <div
            className="h-[500px] overflow-y-auto
  px-2 pb-3"
          >
            <div
              className="mt-7 grid grid-cols-1
  gap-5 lg:grid-cols-2"
            >
              {/* Room Number */}
              <div>
                <Label htmlFor="roomNumber">Số phòng</Label>
                <Input
                  id="roomNumber"
                  name="roomNumber"
                  type="text"
                  value={formik.values.roomNumber}
                  onChange={formik.handleChange}
                  placeholder="Nhập số phòng"
                />
                {formik.errors.roomNumber && formik.touched.roomNumber && (
                  <div
                    className="text-error-500
  text-sm mt-1"
                  >
                    {formik.errors.roomNumber}
                  </div>
                )}
              </div>
              {/* Floor */}
              <div>
                <Label htmlFor="floor">Tầng</Label>
                <Input
                  id="floor"
                  name="floor"
                  type="number"
                  value={formik.values.floor}
                  onChange={formik.handleChange}
                  placeholder="Nhập tầng"
                />
                {formik.errors.floor && formik.touched.floor && (
                  <div
                    className="text-error-500
  text-sm mt-1"
                  >
                    {formik.errors.floor}
                  </div>
                )}
              </div>
              {/* Status */}
              <div>
                <Label htmlFor="status">Trạng thái phòng</Label>
                <Select
                  options={statusOptions}
                  placeholder="Chọn trạng thái"
                  onChange={(value) => formik.setFieldValue("status", value)}
                  defaultValue={formik.values.status}
                />
                {formik.errors.status && formik.touched.status && (
                  <div
                    className="text-error-500
  text-sm mt-1"
                  >
                    {formik.errors.status}
                  </div>
                )}
              </div>
              {/* Clean Status */}
              <div>
                <Label htmlFor="cleanStatus">Trạng thái vệ sinh</Label>
                <Select
                  options={cleanStatusOptions}
                  placeholder="Chọn tình trạng vệ
  sinh"
                  onChange={(value) =>
                    formik.setFieldValue("cleanStatus", value)
                  }
                  defaultValue={formik.values.cleanStatus}
                />
                {formik.errors.cleanStatus && formik.touched.cleanStatus && (
                  <div
                    className="text-error-500
  text-sm mt-1"
                  >
                    {formik.errors.cleanStatus}
                  </div>
                )}
              </div>
              {/* Room Type */}
              <div className="lg:col-span-2">
                <Label htmlFor="roomTypeId">Loại phòng</Label>
                <Select
                  options={roomTypeOptions}
                  placeholder="Chọn loại phòng"
                  onChange={(value) =>
                    formik.setFieldValue("roomTypeId", value)
                  }
                  defaultValue={formik.values.roomTypeId}
                />
                {formik.errors.roomTypeId && formik.touched.roomTypeId && (
                  <div
                    className="text-error-500
  text-sm mt-1"
                  >
                    {formik.errors.roomTypeId}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className="flex items-center gap-3 px-2
  mt-6 lg:justify-end"
          >
            <Button
              size="sm"
              variant="outline"
              onClick={closeModal}
              disabled={isSubmitting}
            >
              Đóng
            </Button>
            <Button size="sm" disabled={isSubmitting}>
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}{" "}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default RoomModalAddOrEdit;
