import React from "react";
import DataTable from "../../../components/common/DataTable";
import { ServiceType } from "../../../common/types/IServiceType";
import ServiceTypeActionDropdown from "./ServiceTypeActionDropdown";
interface ServiceTypesTableProps {
  reload: number;
  onReload: () => void;
}
const ServiceTypeTable: React.FC<ServiceTypesTableProps> = ({
  onReload,
  reload,
}) => {
  return (
    <>
      <DataTable<ServiceType>
        endpoint="/ServiceTypes"
        reload={reload}
        onReload={onReload}
        columns={[
          { header: "Mã dịch vụ", render: (item) => item.id },
          { header: "Tên loại dịch vụ", render: (item) => item.name },
        ]}
        actions={(item) => (
          <ServiceTypeActionDropdown serviceType={item} onReload={onReload} />
        )}
      />
    </>
  );
};

export default ServiceTypeTable;
