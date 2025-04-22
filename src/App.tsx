import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import DuressModePasswordSet from "./pages/DuressPasswordSet";

import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./Service/ firebase";
import DuressMode from "./pages/DuressMode";

const queryClient = new QueryClient();

function App() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isUserSignedIn, setIsUserSignedIn] = useState(Boolean);
  useEffect(() => {
    if (isLoaded && user) {
      setIsUserSignedIn(true);
    } else {
      setIsUserSignedIn(false);
    }
  }, [isLoaded, user]);
  const [isDuressSet, setIsDuressSet] = useState<boolean | null>(null);
  useEffect(() => {
    const checkDuress = async () => {
      if (!isSignedIn || !user) return;

      try {
        const docRef = doc(db, "users", user.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("User document data:", data);
          setIsDuressSet(!!data?.duressModePassword);
        } else {
          console.log("No user document found.");
          setIsDuressSet(false);
        }
      } catch (error) {
        console.error("Error fetching duress password:", error);
        setIsDuressSet(false);
      }
    };

    if (isLoaded && isSignedIn && user) {
      checkDuress();
    }
  }, [isLoaded, isSignedIn, user]);

  const loadingElement = (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
        <svg
          className="w-16 h-16 animate-spin text-gray-900/50"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
        >
          <path
            d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
            stroke="currentColor"
            stroke-width="5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
            stroke="currentColor"
            stroke-width="5"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="text-gray-900"
          ></path>
        </svg>
      </div>
    </div>
  );

  return (
    <ThemeProvider defaultTheme="system" storageKey="shadowlock-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route
                path="/DuressModePasswordSet"
                element={
                  isUserSignedIn ? (
                    <DuressModePasswordSet />
                  ) : (
                    <Navigate to="/sign-in" />
                  )
                }
              />
              <Route
                path="/dashboard"
                element={
                  !isLoaded ? (
                    loadingElement
                  ) : !isSignedIn ? (
                    <Navigate to="/sign-in" />
                  ) : isDuressSet === null ? (
                    loadingElement
                  ) : isDuressSet === false ? (
                    <Navigate to="/Dashboard" replace />
                  ) : (
                    <DuressMode />
                  )
                }
              />
              <Route
                path="/DuressMode"
                element={
                  !isLoaded ? (
                    loadingElement
                  ) : !isSignedIn ? (
                    <Navigate to="/sign-in" replace />
                  ) : isDuressSet === null ? (
                    loadingElement
                  ) : isDuressSet === false ? (
                    <Navigate to="/DuressModePasswordSet" replace />
                  ) : (
                    <DuressMode />
                  )
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
