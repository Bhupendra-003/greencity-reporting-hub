
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
  userType: "citizen" | "ngo";
}

export function PrivateRoute({ children, userType }: PrivateRouteProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }

  if (profile.type !== userType) {
    return <Navigate to={`/${profile.type}/dashboard`} replace />;
  }

  return <>{children}</>;
}
