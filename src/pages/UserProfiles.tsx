import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import PageMeta from "../components/common/PageMeta";
import { User } from "../common/types/AuthTypes";
import axiosInstance from "../common/configs/axiosInstance";
import { selectUser } from "../redux/slices/authSlice";

// Memoized components
const MemoizedUserMetaCard = React.memo(UserMetaCard);
const MemoizedUserInfoCard = React.memo(UserInfoCard);

const UserProfiles = () => {
  // Hàm debounce để trì hoãn tìm kiếm
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };
  const { id } = useParams();
  const currentUser = useSelector(selectUser);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);

  // Debounced fetchUser function
  const debouncedFetchUser = useCallback(
    debounce((uid: number) => {
      setLoading(true);
      axiosInstance
        .get(`/user/${uid}?depth=1`)
        .then((res) => {
          setUserData(res.data);
        })
        .catch((error) => {
          console.error("Failed to fetch user", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300),
    []
  );

  useEffect(() => {
    const userId = id ? Number(id) : currentUser?.id;
    if (userId) {
      debouncedFetchUser(userId);
    }
  }, [id, currentUser, reload, debouncedFetchUser]);

  // Memoized triggerReload function
  const triggerReload = useCallback(() => {
    setReload((prev) => prev + 1);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="Hồ sơ người dùng" description="Thông tin người dùng" />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <MemoizedUserMetaCard
            user={userData!}
            triggerReload={triggerReload}
          />
          <MemoizedUserInfoCard user={userData!} />
        </div>
      </div>
    </>
  );
};

export default UserProfiles;
