import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  useEffect(() => {
    if (user && profile) {
      navigate(`/${profile.type}/dashboard`);
    }
  }, [user, profile, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">
        Welcome to the Community Action Platform
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Report issues, contribute to solutions, and make your community a
        better place.
      </p>
      <div className="space-x-4">
        <Button onClick={() => navigate("/login")}>Login</Button>
        <Button variant="secondary" onClick={() => navigate("/register")}>
          Register
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
