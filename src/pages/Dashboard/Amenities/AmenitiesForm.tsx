import React, { useState } from "react";
import { Amenities } from "../../../common/types/IAmenities";
import * as Yup from "yup";
import { useFormik } from "formik";
import axiosInstance from "../../../common/configs/axiosInstance";
import Swal from "sweetalert2";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
interface AmenitiesFormProps {
  onReload: () => void;

  selectedAmenity: Amenities | null;
}
const AmenitiesForm: React.FC<AmenitiesFormProps> = ({
  onReload,
  selectedAmenity,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const validationSchema = Yup.object({
    name: Yup.string().required("Tên tiện nghi là bắt buộc"),
    icon: Yup.string().required("Biểu tượng cho tiện nghi là bắt buộc"),
  });
  const formik = useFormik({
    initialValues: {
      name: selectedAmenity?.name || "",
      icon: selectedAmenity?.icon || "",
      description: selectedAmenity?.description || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true); // bật loading
        let response;
        if (selectedAmenity) {
          response = await axiosInstance.put(
            `/Amenitie/${selectedAmenity.id}`,
            values
          );
        } else {
          response = await axiosInstance.post("/Amenitie", values);
        }

        if (response.status === 200) {
          Swal.fire({
            title: "Thành công!",
            text: selectedAmenity
              ? "Cập nhật phòng thành công"
              : "Thêm phòng thành công",
            icon: "success",
            customClass: {
              container: "swal-container",
            },
          }).then((result) => {
            if (result.isConfirmed) {
              formik.resetForm();
              onReload();
            }
          });
        }
      } catch (error) {
        console.error("Gặp lỗi:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });
  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col">
      <div className="h-fit overflow-y-auto px-2 pb-3">
        <div className="mt-7 grid grid-cols-1 gap-5">
          {/* Room Number */}
          <div>
            <Label htmlFor="name">Tên tiện ích</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
              placeholder="Nhập tên tiện ích"
            />

            {formik.errors.name && formik.touched.name && (
              <div className="text-error-500 text-sm mt-1">
                {formik.errors.name}
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Input
              id="description"
              name="description"
              type="text"
              value={formik.values.description}
              onChange={formik.handleChange}
              placeholder="Nhập số phòng"
            />
            {formik.errors.description && formik.touched.description && (
              <div className="text-error-500 text-sm mt-1">
                {formik.errors.description}
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="icon">Biểu tượng</Label>
            <Input
              id="icon"
              name="icon"
              type="text"
              value={formik.values.icon}
              onChange={formik.handleChange}
              placeholder="Nhập số phòng"
            />
            {formik.errors.icon && formik.touched.icon && (
              <div
                className="text-error-500 text-sm
  mt-1"
              >
                {formik.errors.icon}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 px-2 mt-6">
        <button
          type="submit"
          className="flex items-center justify-center
  px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}{" "}
        </button>
      </div>
    </form>
  );
};

export default AmenitiesForm;
