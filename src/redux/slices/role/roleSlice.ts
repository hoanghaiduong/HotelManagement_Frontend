import { Role } from "./../../../common/types/AuthTypes";
// src/features/user/Roleslice.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchRoles } from "./roleThunk";

interface RoleState {
  data: Role[];
  loading: boolean;
  error: string | null;
}
const initialState: RoleState = {
  data: [],
  loading: false,
  error: null,
};

const RoleSlice = createSlice({
  name: "Roles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi không xác định";
      });
  },
});

export default RoleSlice.reducer;
