import { useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import { Link } from "react-router";
import Button from "../../../components/ui/button/Button";
import RoomTypesTable from "./RoomTypesTable";

const RoomTypesManager: React.FC = () => {
  const [reload, setReload] = useState<number>(0);
  return (
    <div>
      <PageMeta title="Quản Lý Loại Phòng" description="Quản Lý Loại Phòng" />

      <PageBreadcrumb pageTitle="Quản Lý Loại Phòng" />

      <div className="space-y-6">
        <ComponentCard
          title="Quản Lý Loại Phòng"
          right={
            <Link to={"/roomType/add"}>
              <Button size="sm" variant="primary">
                Thêm mới
              </Button>
            </Link>
          }
        >
          <RoomTypesTable
            reload={reload}
            onReload={() => setReload((prev) => prev + 1)}
          />
        </ComponentCard>
      </div>
    </div>
  );
};

export default RoomTypesManager;
