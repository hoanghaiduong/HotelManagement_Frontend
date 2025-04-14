import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { data } from "react-router";
import { useEffect } from "react";
import { fetchUser, fetchUsers } from "../../redux/slices/user/userThunks";

export default function Home() {
  const dispatch = useAppDispatch();
  // Lấy state trong Redux store
  const {
    data: users,
    selectedUser,
    loading,
    error,
  } = useAppSelector((state) => state.users);

  useEffect(() => {
    // Gọi API
    dispatch(fetchUser({id:21}))
    // dispatch(fetchUsers({ PageNumber: 1, PageSize: 50, Depth: 0, Search: "" }));
  }, [dispatch]);

  console.log(selectedUser)
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Lỗi: {error}</p>;
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
