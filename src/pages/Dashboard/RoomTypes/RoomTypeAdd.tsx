import * as Yup from "yup";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import axiosInstance from "../../../common/configs/axiosInstance";
import Swal from "sweetalert2";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { roomTypeValidationSchema } from "./validationSchema";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import ReusableFileDropzone from "../../../components/common/ReusableFileDropzone";

interface FormValues {
  name: string;
  description: string;
  pricePerNight: number;
  numberOfBathrooms: number;
  numberOfBeds: number;
  singleBed: number;
  doubleBed: number;
  sizes: number;
  capacity: number;
  thumbnailFile: File | null;
  Images: File[];
}

const RoomTypeAdd: React.FC = () => {
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [imgPreviews, setImgPreviews] = useState<string[]>([]);
  const navigate = useNavigate();
  const initialValues: FormValues = {
    name: "",
    description: "",
    pricePerNight: 0,
    numberOfBathrooms: 0,
    numberOfBeds: 0,
    singleBed: 0,
    doubleBed: 0,
    sizes: 0,
    capacity: 0,
    thumbnailFile: null,
    Images: [],
  };

  const onSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    const formData = new FormData();
    formData.append("Name", values.name);
    formData.append("Description", values.description);
    formData.append("PricePerNight", String(values.pricePerNight));
    formData.append("NumberOfBathrooms", String(values.numberOfBathrooms));
    formData.append("NumberOfBeds", String(values.numberOfBeds));
    formData.append("SingleBed", String(values.singleBed));
    formData.append("DoubleBed", String(values.doubleBed));
    formData.append("Sizes", String(values.sizes));
    formData.append("Capacity", String(values.capacity));
    if (values.thumbnailFile) {
      formData.append("Thumbnail", values.thumbnailFile);
    }
    values.Images.forEach((file) => formData.append("Images", file));

    try {
      const res = await axiosInstance.post("/RoomType", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200 || res.status === 201) {
        await Swal.fire({
          title: "Thành công!",
          text: "Đã thêm loại phòng.",
          icon: "success",
        });
        navigate("/roomTypes");
      }
    } catch (err) {
      Swal.fire({ title: "Lỗi", text: "Gửi dữ liệu thất bại.", icon: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Thêm loại phòng"
        description="Thêm loại phòng mới cho khách sạn"
      />
      <PageBreadcrumb pageTitle="Thêm loại phòng" />

      <Formik
        initialValues={initialValues}
        validationSchema={roomTypeValidationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="space-y-6">
            <div
              className="grid grid-cols-1
sm:grid-cols-3 gap-5"
            >
              <ComponentCard className="col-span-2" title="Thông tin cơ bản">
                {/* Tên */}
                <div className="form-control mb-4">
                  <Label>
                    Tên loại phòng <span className="text-error-500">*</span>
                  </Label>
                  <Field name="name" as={Input} placeholder="Deluxe..." />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                {/* Mô tả */}
                <div className="form-control mb-4">
                  <Label>Mô tả</Label>
                  <Field name="description">
                    {({ form, field }: { form: any; field: any }) => (
                      <TextArea
                        value={field.value}
                        rows={6}
                        onChange={(val: string) =>
                          form.setFieldValue("description", val)
                        }
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </ComponentCard>

              {/* Thumbnail */}
              <ComponentCard title="Ảnh đại diện">
                <ReusableFileDropzone
                  title="Tải lên hình ảnh"
                  multiple={false}
                  onFilesChange={(files, previews) => {
                    if (files.length > 0) {
                      setFieldValue("thumbnailFile", files[0]);
                      setThumbPreview(previews[0]);
                    }
                  }}
                />
                <ErrorMessage
                  name="thumbnailFile"
                  component="div"
                  className="text-red-500 text-sm mt-2"
                />
                {thumbPreview && (
                  <img
                    src={thumbPreview}
                    alt="Thumb Preview"
                    className="mt-2 max-h-32"
                  />
                )}
              </ComponentCard>
            </div>

            <ComponentCard title="Thông tin bổ sung">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                {[
                  { label: "Giá thuê đêm", name: "pricePerNight" },
                  { label: "Số phòng tắm", name: "numberOfBathrooms" },
                  { label: "Số giường đơn", name: "singleBed" },
                  { label: "Số giường đôi", name: "doubleBed" },
                  { label: "Kích thước (m2)", name: "sizes" },
                  { label: "Sức chứa", name: "capacity" },
                ].map((f) => (
                  <div className="form-control mb-4" key={f.name}>
                    <Label>
                      {f.label} <span className="text-error-500">*</span>
                    </Label>
                    <Field
                      name={f.name}
                      as={Input}
                      type="number"
                      placeholder=""
                    />
                    <ErrorMessage
                      name={f.name}
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                ))}
              </div>
            </ComponentCard>

            <ComponentCard
              title="Một số hình ảnh
khác"
            >
              <ReusableFileDropzone
                title="Tải lên hình phòng"
                multiple
                accept={{ "image/*": [] }}
                onFilesChange={(files, previews) => {
                  setFieldValue("Images", files);
                  setImgPreviews(previews);
                }}
              />
              <ErrorMessage
                name="Images"
                component="div"
                className="text-red-500 text-sm mt-2"
              />

              {imgPreviews.length > 0 && (
                <div
                  className="grid grid-cols-2
sm:grid-cols-3 gap-4 mt-2"
                >
                  {imgPreviews.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`Preview ${idx}`}
                      className="max-h-24 rounded"
                    />
                  ))}
                </div>
              )}
            </ComponentCard>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center
justify-center w-full px-4 py-3 text-sm font-medium
text-white rounded-lg bg-brand-500 hover:bg-brand-600
disabled:opacity-50"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu lại"}
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default RoomTypeAdd;
