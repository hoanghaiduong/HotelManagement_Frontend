///actions

import { createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from "../../../common/configs/axiosInstance";
import { FetchUserPayload, FetchUsersPayload, UserResponse } from "./UserTypes";
export const fetchUsers = createAsyncThunk<UserResponse, FetchUsersPayload>(
  "users/fetchUsers",
  async ({ PageNumber, PageSize, Depth, Search }) => {
    const response = await axiosInstance.get<UserResponse>("/User", {
      params: {
        PageNumber,
        PageSize,
        Depth,
        Search: Search?.trim() || null,
      },
    });
   
    return response.data;
  }
);
export const fetchUser = createAsyncThunk(
  "users/fetchUser",
  async ({ id, depth }: FetchUserPayload) => {
    const query = depth != undefined ? `?Depth=${depth}` : "";
    const response = await axiosInstance.get(`/User/${id}${query}`);
    return response.data;
  }
);
