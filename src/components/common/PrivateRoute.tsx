import { ReactNode } from "react";
import { Navigate } from "react-router";
import {
  selectIsAdminOrEmployee,
  selectIsAuthenticated,
} from "../../redux/slices/authSlice";
import { useSelector } from "react-redux";
interface PrivateRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}
const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdminOrEmployee = useSelector(selectIsAdminOrEmployee);
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }
  if (requireAdmin && !isAdminOrEmployee) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};
export default PrivateRoute;
