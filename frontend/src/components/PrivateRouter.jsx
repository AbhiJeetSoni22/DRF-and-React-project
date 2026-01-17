import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};

export default function PrivateRouter({redirectTo='/login'}) {
  return isAuthenticated() ? <Outlet /> : <Navigate to={redirectTo} replace />;
}
