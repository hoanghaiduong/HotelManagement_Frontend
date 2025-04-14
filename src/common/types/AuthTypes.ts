// authTypes.ts
export interface User {
  id?: number;
  email: string;
  avatar?: string;
  password: string;
  firstName?: string | any;
  lastName?: string | any;
  address?: string;
  phoneNumber?: string;
  isDisabled?: boolean;
  //thêm 1 số thuộc tính khác nếu cần


  
  roles?: Role[];
}
export interface TokenModel {
  accessToken: string;
  refreshToken: string;
}
export interface Role {
  id: Number;
  name: string;
}
export interface AuthState {
  user: User | null;
  token: TokenModel | null;
  isAuthenticated: boolean;
  status?: string;
  error?: string | object | any;
}

export type LoginPayload = {
  user: User;
  token: TokenModel;
};
export type AuthAction =
  | { type: "auth/signin"; payload: LoginPayload }
  | { type: "auth/signup" };

export type AuthDTO = {
  email: string;
  password: string;
};
