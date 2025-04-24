import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../Service/ firebase";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import DashboardNavbar from "@/components/DashboardNavbar";
import * as CryptoJS from "crypto-js";

const DuressModePasswordSet = () => {
  const { user } = useUser();
  const [duressPassword1, setDuressPassword1] = useState("");
  const [duressPassword2, setDuressPassword2] = useState("");
  const [addDuress, setAddDuress] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isSecure, setIsSecure] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // For controlling the modal visibility
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePasswordChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDuressPassword1(value);

    const pattern =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    setIsSecure(pattern.test(value));
  };

  const handlePasswordChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDuressPassword2(e.target.value);
  };

  function generateSalt(length = 16): string {
    return CryptoJS.lib.WordArray.random(length).toString(CryptoJS.enc.Hex);
  }

  const addDuressPassword = async (duressPassword: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated!",
        variant: "destructive",
      });
      return;
    }

    if (duressPassword1 !== duressPassword2) {
      toast({
        title: "Error",
        description: "Passwords do not match!",
        variant: "destructive",
      });
      return;
    }

    setAddDuress(true);
    setShowModal(true); // Show the modal while saving

    try {
      await setDoc(doc(db, "users", user.id), {
        userEmail: user?.primaryEmailAddress?.emailAddress,
        duressMode: false,
        duressModePassword: duressPassword,
        salt: generateSalt(),
        id: user.id,
      });

      toast({
        title: "Success",
        description: "Duress password set successfully!",
        variant: "default",
      });

      // Mark success and allow navigation
      setIsSuccess(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set duress password.",
        variant: "destructive",
      });
      console.error("Error adding document:", error);
    }

    setAddDuress(false);
  };

  const handleNavigate = () => {
    if (isSuccess) {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <DashboardNavbar />
      <div className="flex justify-center items-center w-full h-screen px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Set Duress Mode Password</CardTitle>
            </CardHeader>

            <CardContent>
              <label className="block text-slate-800 mb-1">Enter Password</label>
              <div className="relative flex items-center border rounded-md px-2 mb-4">
                <input
                  type={showPassword1 ? "text" : "password"}
                  value={duressPassword1}
                  onChange={handlePasswordChange1}
                  placeholder="Enter Password"
                  className="w-full h-10 outline-none"
                />
                <button
                  type="button"
                  className="text-gray-600"
                  onClick={() => setShowPassword1(!showPassword1)}
                >
                  {showPassword1 ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              <label className="block text-slate-800 mb-1">Re-enter Password</label>
              <div className="relative flex items-center border rounded-md px-2 mb-2">
                <input
                  type={showPassword2 ? "text" : "password"}
                  value={duressPassword2}
                  onChange={handlePasswordChange2}
                  placeholder="Re-enter Password"
                  className="w-full h-10 outline-none"
                />
                <button
                  type="button"
                  className="text-gray-600"
                  onClick={() => setShowPassword2(!showPassword2)}
                >
                  {showPassword2 ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              {!isSecure && duressPassword1 && (
                <div className="text-red-500 text-sm">
                  Password should be at least 8 characters long and include:
                  <ul className="list-disc ml-5 mt-1">
                    <li>Uppercase and lowercase letters</li>
                    <li>Numbers</li>
                    <li>Special characters (e.g., @, $, !, %)</li>
                  </ul>
                </div>
              )}

              {duressPassword1 &&
                duressPassword2 &&
                duressPassword1 !== duressPassword2 && (
                  <span className="text-red-500 text-sm">
                    Passwords do not match!
                  </span>
                )}
            </CardContent>

            <CardFooter>
              <div className="flex flex-col items-center w-full gap-2">
                <Button
                  onClick={() => addDuressPassword(duressPassword2)}
                  className="w-full bg-black text-white hover:bg-gray-800"
                  disabled={
                    addDuress ||
                    !isSecure ||
                    duressPassword1 !== duressPassword2
                  }
                >
                  {addDuress ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    "Save Password"
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Modal for saving progress and success */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-80 text-center">
            {addDuress ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-6 h-6 animate-spin mb-4" />
                <span>Saving your duress password...</span>
              </div>
            ) : isSuccess ? (
              <div>
                <span className="text-shadow-purple font-semibold mb-4">
                  Duress password set successfully!
                </span>
                <a href="/dashboard">
                <Button
                  className="w-full bg-shadow-purple text-white hover:bg-shadow-purple-600"
                >
                  Go to Dashboard
                </Button>
                </a>
              </div>
            ) : (
              <span className="text-red-500">Failed to set password.</span>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default DuressModePasswordSet;
