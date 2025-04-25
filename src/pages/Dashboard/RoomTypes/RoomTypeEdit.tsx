import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axiosInstance from "../../../common/configs/axiosInstance";
import Swal from "sweetalert2";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import ReusableFileDropzone from "../../../components/common/ReusableFileDropzone";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Constants from "../../../common/configs/Constants";
import * as Yup from "yup";
interface FileItem {
  id: string;
  file?: File;
  url?: string;
}

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
  existingThumbnailUrl: string | null;
  Images: FileItem[];
}
const roomTypeValidationSchema = Yup.object().shape({
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
 
});

const RoomTypeEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<FormValues | null>(null);
  useEffect(() => {
    axiosInstance
      .get(`/RoomType/${id}?Depth=2`)
      .then((res) => {
        const data = res.data;
        const imgs = data.Images.map((url: string, idx: number) => ({
          id: `existing-${idx}`,
          url,
        }));
        setInitialValues({
          name: data.name,
          description: data.description || "",
          pricePerNight: data.pricePerNight,
          numberOfBathrooms: data.numberOfBathrooms,
          numberOfBeds: data.numberOfBeds,
          singleBed: data.singleBed,
          doubleBed: data.doubleBed,
          sizes: data.sizes,
          capacity: data.capacity,
          thumbnailFile: null,
          existingThumbnailUrl: data.thumbnail,
          Images: imgs,
        });
      })
      .catch(console.error);
  }, [id]);
  if (!initialValues) return <div>Đang tải...</div>;
  const onSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    const formData = new FormData();
    Object.entries({
      Name: values.name,
      Description: values.description,
      PricePerNight: values.pricePerNight,
      NumberOfBathrooms: values.numberOfBathrooms,
      NumberOfBeds: values.numberOfBeds,
      SingleBed: values.singleBed,
      DoubleBed: values.doubleBed,
      Sizes: values.sizes,
      Capacity: values.capacity,
    }).forEach(([key, val]) => formData.append(key, String(val)));

    if (values.thumbnailFile)
      formData.append("Thumbnail", values.thumbnailFile);
    values.Images.forEach((item, idx) => {
      if (item.file) {
        // file mới
        formData.append("Images", item.file as File);
      }
      if (item.url) {
        // URL cũ -> backend map vào UpdateRoomTypeDTO.KeptImages
        formData.append("KeptImages", item.url);
      }
    });

    try {
      const res = await axiosInstance.put(`/RoomType/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200 || res.status === 201) {
        await Swal.fire({
          title: "Thành công!",
          text: "Cập nhật thành công",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/roomTypes");
          }
        });
      }
    } catch (e) {
      Swal.fire({ title: "Lỗi", text: "Cập nhật thất bại", icon: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDragEnd = (
    result: any,
    images: FileItem[],
    setFieldValue: any
  ) => {
    if (!result.destination) return;
    const reordered = Array.from(images);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setFieldValue("Images", reordered);
  };
  return (
    <>
      <PageMeta
        title="Chỉnh sửa loại phòng"
        description="Cập nhật loại phòng"
      />

      <PageBreadcrumb pageTitle="Chỉnh sửa loại phòng" />
      <Formik
        initialValues={initialValues}
        validationSchema={roomTypeValidationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-6">
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <ComponentCard className="md:col-span-2" title="Thông tin cơ bản">
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
                    {({ field, form }: any) => (
                      <TextArea
                        rows={5}
                        value={field.value}
                        onChange={(v: string) =>
                          form.setFieldValue("description", v)
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

                {/* Các số liệu */}
                <div
                  className="grid grid-cols-2
  sm:grid-cols-3 gap-4"
                >
                  {[
                    { label: "Giá/phòng (đêm)", name: "pricePerNight" },
                    { label: "Phòng tắm", name: "numberOfBathrooms" },
                    { label: "Giường đơn", name: "singleBed" },
                    { label: "Giường đôi", name: "doubleBed" },
                    { label: "Số giường", name: "numberOfBeds" },
                    { label: "Kích thước (m2)", name: "sizes" },
                    { label: "Sức chứa", name: "capacity" },
                  ].map(({ label, name }) => (
                    <div key={name} className="form-control mb-4">
                      <Label>
                        {label} <span className="text-error-500">*</span>
                      </Label>

                      <Field name={name} as={Input} type="number" />
                      <ErrorMessage
                        name={name}
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </ComponentCard>

              <ComponentCard title="Ảnh đại diện">
                <ReusableFileDropzone
                  title="Tải lên hình ảnh"
                  multiple={false}
                  onFilesChange={(files, previews) => {
                    if (files.length > 0) {
                      setFieldValue("thumbnailFile", files[0]);
                    }
                  }}
                  existingUrl={values.existingThumbnailUrl!}
                />

                <ErrorMessage
                  name="thumbnailFile"
                  component="div"
                  className="text-red-500 text-sm mt-2"
                />
              </ComponentCard>
            </div>

            <ComponentCard title="Hình phòng (kéo thả để sắp xếp)">
              <ReusableFileDropzone
                title="Thêm ảnh"
                multiple
                accept={{ "image/*": [] }}
                onFilesChange={(files, _) => {
                  const newItems = files.map((f, i) => ({
                    id: `new-${i}`,
                    file: f,
                  }));
                  setFieldValue("Images", [...values.Images, ...newItems]);
                }}
              />

              <DragDropContext
                onDragEnd={(res) =>
                  handleDragEnd(res, values.Images, setFieldValue)
                }
              >
                <Droppable droppableId="imgs" direction="horizontal">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="grid grid-cols-2
  sm:grid-cols-4 md:grid-cols-6 gap-4 mt-4"
                    >
                      {values.Images.map((item, idx) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={idx}
                        >
                          {(prov) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              className="relative rounded-lg overflow-hidden shadow-lg"
                            >
                              <img
                                src={
                                  item.url
                                    ? `${Constants.BASE_URL_BACKEND}/${item.url}`
                                    : URL.createObjectURL(item.file!)
                                }
                                alt="preview"
                                className="w-full h-32 object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const filtered = values.Images.filter(
                                    (_, i) => i !== idx
                                  );

                                  setFieldValue("Images", filtered);
                                }}
                                className="absolute top-1 right-1 bg-white bg-opacity-75 rounded-full p-1"
                              >
                                <span className="text-red-500 font-bold">
                                  ×
                                </span>
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </ComponentCard>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 text-white bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default RoomTypeEdit;
