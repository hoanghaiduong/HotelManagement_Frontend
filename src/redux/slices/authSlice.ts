// authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AuthState,
  LoginPayload,
  TokenModel,
} from "../../common/types/AuthTypes";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setToken: (state, action: PayloadAction<TokenModel>) => {
      state.token = action.payload;
    },
  },
});
export const { login, logout, setToken } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }): TokenModel | null =>
  state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectIsAdminOrEmployee = (state: { auth: AuthState }) =>
  state.auth.user?.roles?.some(
    (role) =>
      role.name.toLowerCase() === "admin" ||
      role.name.toLowerCase() === "employee"
  ) || false;
