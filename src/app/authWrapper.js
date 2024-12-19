import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AuthWrapper = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setIsLoading(false);
        router.replace("/");
        return;
      }

      try {
        const response = await axios.get(
          "https://cognitive-dev-734522323885.asia-southeast2.run.app/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.username) {
          setIsAuthenticated(true);
          setIsLoading(false);

          // Replace the current history state to prevent back navigation
          window.history.replaceState(null, "", window.location.href);

          // Disable browser back button functionality
          window.onpopstate = (event) => {
            event.preventDefault();
            const confirmLeave = window.confirm(
              "Apakah Anda yakin ingin kembali? Anda akan keluar dari sesi ini dan harus mengulang dari awal."
            );

            if (confirmLeave) {
              localStorage.removeItem("access_token"); // Clear token on back navigation
              router.replace("/"); // Redirect to homepage
            } else {
              // Push the current state back to maintain the same URL
              window.history.pushState(null, "", window.location.href);
            }
          };
        }
      } catch (error) {
        localStorage.removeItem("access_token");
        setIsLoading(false);
        router.replace("/");
      }
    };

    checkAuth();

    // Detect page refresh and show alert
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      const confirmRefresh = window.confirm(
        "Halaman ini akan dimuat ulang. Apakah Anda ingin melanjutkan ke halaman instruksi?"
      );

      if (confirmRefresh) {
        event.returnValue = ""; // Required for `beforeunload` to work in some browsers
        router.push("/home/instruction"); // Navigate to the instruction page
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Block back navigation by pushing a new state
    window.history.pushState(null, document.title, window.location.href);

    const blockBackNavigation = (event) => {
      event.preventDefault();
      const confirmLeave = window.confirm(
        "Konfirmasi sekali lagi, apakah Anda yakin?"
      );

      if (confirmLeave) {
        localStorage.removeItem("access_token");
        router.replace("/");
      } else {
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("popstate", blockBackNavigation);

    return () => {
      window.removeEventListener("popstate", blockBackNavigation);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render children only if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default AuthWrapper;
