import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AuthWrapper = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Get the token from local storage
      const token = localStorage.getItem("access_token");

      // If no token, immediately stop loading and prevent access
      if (!token) {
        setIsLoading(false);
        router.push("/");
        return;
      }

      try {
        // Verify token with /users/me endpoint
        const response = await axios.get("http://localhost:8000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // If token is valid, set authenticated state
        if (response.data.username) {
          setIsAuthenticated(true);
          setIsLoading(false);
        }
      } catch (error) {
        // Token invalid or expired, remove token and redirect
        localStorage.removeItem("access_token");
        setIsLoading(false);
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, return null to prevent rendering
  if (!isAuthenticated) {
    return null;
  }

  // Render children only if authenticated
  return children;
};

export default AuthWrapper;
