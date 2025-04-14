// src/features/user/userThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from "../../../common/configs/axiosInstance";

export const fetchRoles = createAsyncThunk("roles/fetchRoles", async () => {
  const response = await axiosInstance.get("/Role");
  return response.data;
});
