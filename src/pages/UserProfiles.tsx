import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/authSlice";

import { User } from "../common/types/AuthTypes";

import { data, useLocation, useParams } from "react-router";

interface UserProfileProps {
  user?: User;
}

const UserProfiles: React.FC<UserProfileProps> = ({ user }) => {
  const authUser = useSelector(selectUser);
  console.log(user, authUser);
  const { id } = useParams();
  const location=useLocation();
  console.log(location)
  const userData = id ? user : authUser;
  console.log(userData)
  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard userData={userData} />
          <UserInfoCard />
          <UserAddressCard />
        </div>
      </div>
    </>
  );
};
export default UserProfiles;
