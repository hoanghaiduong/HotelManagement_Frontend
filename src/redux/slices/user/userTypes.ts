import { User } from "../../../common/types/AuthTypes";

export interface PaginationInfo {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  pageSize: number;
  previousPage: number | null;
  totalCount: number;
  totalPages: number;
}

export interface UserResponse {
  items: User[];
  pagination?:PaginationInfo;
}
export interface UserState {
  data:UserResponse;
  selectedUser?: User; // User hiện tại khi xem chi tiết
  loading: boolean;
  error: string | null;
}

// Định nghĩa kiểu payload cho các tham số truyền vào
export interface FetchUsersPayload {
  PageNumber: number;
  PageSize: number;
  Depth: number;
  Search?: string;
}
export interface FetchUserPayload {
  id: number;
  depth?: number;
}
