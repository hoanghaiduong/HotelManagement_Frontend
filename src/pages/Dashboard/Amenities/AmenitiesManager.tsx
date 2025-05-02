import React, { useEffect, useState } from "react";
import { Amenities } from "../../../common/types/IAmenities";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import AmenitiesForm from "./AmenitiesForm";
import AmenitiesTable from "./AmenitiesTable";

const AmenitiesManager = () => {
  const [reload, setReload] = useState<number>(0);
  const triggerReload = (): void => {
    setReload((pre) => pre + 1);
  };
  const [selectedAmenity, setSelectedAmenity] = useState<Amenities | null>(
    null
  );
  useEffect(() => {
    setSelectedAmenity(null);
  }, [reload]);
  return (
    <div>
      <PageMeta title="Quản Lý Tiện Nghi" description="Quản Lý Tiện Nghi" />
      <PageBreadcrumb pageTitle="Quản Lý Tiện Nghi" />
      <div className="">
        <div className="grid grid-cols-6 gap-4 mt-4">
          {/* Danh sách tiện nghi */}
          <div
            className="col-span-12 bg-white dark:bg-white/[0.03] p-4
  rounded-xl shadow lg:col-span-6"
          >
            <AmenitiesForm
              selectedAmenity={selectedAmenity}
              onReload={triggerReload}
            />
          </div>
          <div
            className="col-span-12 bg-white dark:bg-white/[0.03] p-4
  rounded-xl shadow lg:col-span-6"
          >
            <AmenitiesTable
              onSelectAmenity={setSelectedAmenity}
              reload={reload}
              onReload={triggerReload}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmenitiesManager;
