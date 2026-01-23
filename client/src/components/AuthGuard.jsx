import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

const AuthGuard = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
