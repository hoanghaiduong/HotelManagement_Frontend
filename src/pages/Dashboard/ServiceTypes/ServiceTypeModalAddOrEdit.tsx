import React from "react";
import { ServiceType } from "../../../common/types/IServiceType";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Modal } from "../../../components/ui/modal";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import ShowCustomSwal from "../../../components/common/CustomSwal";
import axiosInstance from "../../../common/configs/axiosInstance";
interface ServiceTypeModalAddOrEdit {
  serviceType?: ServiceType | null;
  isOpen: boolean;
  closeModal: () => void;
  onReload: () => void;
}
const ServiceTypeModalAddOrEdit: React.FC<ServiceTypeModalAddOrEdit> = ({
  serviceType,
  isOpen,
  closeModal,
  onReload,
}) => {
  const validationSchema = Yup.object({
    name: Yup.string().required("Tên loại dịch vụ là bắt buộc."),
  });
  const formik = useFormik({
    initialValues: {
      name: serviceType?.name || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        let response;
        if (serviceType) {
          // EDIT
          response = await axiosInstance.put(
            `/ServiceTypes/${serviceType.id}`,
            values
          );
        } else {
          // ADD
          response = await axiosInstance.post("/ServiceTypes", values);
        }
        if (response.status === 200 || response.status === 201) {
          ShowCustomSwal({
            title: serviceType ? "Update" : "Add" + "Successfully",
            text:
              response?.data?.message ||
              `${
                serviceType
                  ? "Cập nhật loại dịch vụ thành công"
                  : "Thêm loại dịch vụ thành công"
              }`,
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              closeModal();
              onReload();
            }
          });
        }
      } catch (error: any) {
        console.error("Error saving service:", error);
        ShowCustomSwal({
          title: "Error",
          text: error?.message,
          icon: "error",
        });
      }
    },
  });
  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
      <div
        className="relative w-full max-w-[700px] overflow-y-auto
  rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="px-2 pr-14">
            <h4
              className="mb-2 text-2xl font-semibold text-gray-800
  dark:text-white/90"
            >
              {serviceType
                ? "Sửa thông tin loại dịch vụ"
                : "Thêm mới loại dịch vụ"}
            </h4>
            <p
              className="mb-6 text-sm text-gray-500 dark:text-gray-400
  lg:mb-7"
            >
              {serviceType
                ? "Điền thông tin loại dịch vụ cần cập nhật."
                : "Vui lòng nhập thông tin loại dịch vụ."}
            </p>
          </div>
          <div className="flex flex-col">
            <div className="h-fit overflow-y-auto px-2 pb-3">
              <div className="">
                <div>
                  <Label>
                    Tên dịch vụ <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="name"
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    placeholder="Enter service name"
                  />
                  {formik.errors.name && formik.touched.name && (
                    <div className="text-error-500 text-sm mt-1">
                      {formik.errors.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm">Save Changes</Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ServiceTypeModalAddOrEdit;
