import * as Yup from "yup";
export const roomTypeValidationSchema = Yup.object().shape({
  name: Yup.string().required("Tên loại phòng là bắt buộc"),
  description: Yup.string(),
  pricePerNight: Yup.number()
    .min(1, "Phải lớn hơn 0")
    .required("Giá thuê đêm là bắt buộc"),
  numberOfBathrooms: Yup.number().min(0).required("Số phòng tắm là bắt buộc"),
  numberOfBeds: Yup.number().min(0).required("Số giường là bắt buộc"),
  singleBed: Yup.number().min(0).required("Số giường đơn là bắt buộc"),
  doubleBed: Yup.number().min(0).required("Số giường đôi là bắt buộc"),
  sizes: Yup.number()
    .min(1, "Phải lớn hơn 0")
    .required("Kích thước là bắt buộc"),
  capacity: Yup.number()
    .min(1, "Phải lớn hơn 0")
    .required("Sức chứa là bắt buộc"),
  thumbnailFile: Yup.mixed().required("Thumbnail là bắt buộc"),
  Images: Yup.array()
    .min(1, "Phải có ít nhất 1 ảnh")
    .required("Ảnh bổ sung là bắt buộc"),
});
