import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import UsersTable from "./tables/UsersTable";
import Button from "../../components/ui/button/Button";
import { useModal } from "../../hooks/useModal";
import UserModalAddOrEdit from "./UserModalAddOrEdit";
import { useCallback, useState } from "react";

const UserManager = () => {
  const { isOpen, openModal, closeModal } = useModal();
  // state dùng để trigger reload dữ liệu trong UsersTable
  const [reload, setReload] = useState<number>(0);

  // Callback được truyền xuống modal khi lưu thành công
  const handleRefresh = useCallback(() => {
    // tăng giá trị reload để trigger useEffect trong UsersTable
    setReload((prev) => prev + 1);
  }, []);

  const handleModalClose = () => {
    closeModal();
    //reload
    setReload((prev) => prev + 1);
  };

  return (
    <>
      <PageMeta
        title="Quản lý người dùng"
        description="Đây là trang hiển thị danh sách người dùng của hệ thống!"
      />
      <PageBreadcrumb pageTitle="Danh sách người dùng" />
      <div className="space-y-6">
        <ComponentCard
          title="Quản lý người dùng"
          right={
            <Button onClick={openModal} size="sm" variant="primary">
              Thêm mới
            </Button>
          }
        >
          <UsersTable reload={reload} onReload={handleRefresh} />
        </ComponentCard>
      </div>
      {/* 
      Render modal thêm mới người dùng */}
      <UserModalAddOrEdit
        isOpen={isOpen}
        closeModal={handleModalClose}
        onRefresh={handleRefresh}
      />
    </>
  );
};

export default UserManager;
