import React, { useState } from "react";
import { useModal } from "../../../hooks/useModal";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Button from "../../../components/ui/button/Button";
import ServiceTypeTable from "./ServiceTypeTable";
import ServiceTypeModalAddOrEdit from "./ServiceTypeModalAddOrEdit";

const ServiceTypeManager = () => {
  const [reload, setReload] = useState<number>(0);
  const { openModal, isOpen, closeModal } = useModal();
  const triggerReload = async () => {
    setReload((prev) => prev + 1);
  };
  return (
    <div>
      <PageMeta
        title="Quản Lý Loại Dịch Vụ"
        description="Quản Lý Loại Dịch Vụ"
      />
      <PageBreadcrumb pageTitle="Quản Lý Loại Dịch Vụ" />
      <div className="space-y-6">
        <ComponentCard
          title="Quản Lý Loại Phòng"
          right={
            <Button size="sm" variant="primary" onClick={openModal}>
              Thêm mới
            </Button>
          }
        >
          <ServiceTypeTable reload={reload} onReload={triggerReload} />
        </ComponentCard>
      </div>
      {isOpen && (
        <ServiceTypeModalAddOrEdit
          onReload={triggerReload}
          isOpen={isOpen}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default ServiceTypeManager;
