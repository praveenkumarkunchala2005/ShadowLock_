import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  Download,
  Lock,
  ShieldOff,
  Shield,
  FileText,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../Service/ firebase";
import { useUser } from "@clerk/clerk-react";
import DashboardNavbar from "@/components/DashboardNavbar";
import Footer from "@/components/Footer";

const generateFakePassword = () => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(
    { length: 10 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

const DuressMode = () => {
  const { toast } = useToast();
  const [isDuressSet, setIsDuressSet] = useState("");
  const [duressMode, setDuressMode] = useState(false);
  const [duressPassword, setDuressPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState("activate");
  const { isSignedIn, user, isLoaded } = useUser();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (isLoaded && user) {
      const primaryId = user.primaryEmailAddressId;
      const emailObj = user.emailAddresses.find(
        (email) => email.id === primaryId
      );
      setUserEmail(emailObj?.emailAddress || "");
    }
  }, [user, isLoaded]);

  useEffect(() => {
    const checkDuress = async () => {
      if (!isSignedIn || !user) return;
      try {
        const docRef = doc(db, "users", user.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setIsDuressSet(data?.duressModePassword);
          setDuressMode(data?.duressMode || false);
        } else {
          setIsDuressSet("");
        }
      } catch (error) {
        console.error("Error fetching duress password:", error);
        setIsDuressSet("");
      }
    };
    checkDuress();
  }, [user, isSignedIn]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDuressActivation = async () => {
    if (duressPassword !== isDuressSet) {
      setValidationError("Invalid duress password");
      return;
    }
    try {
      const docRef = doc(db, "users", user.id);
      await updateDoc(docRef, { duressMode: true });
      setDuressMode(true);
      setValidationError("");
      toast({
        title: "Duress Mode Activated:",
        variant: "default",
        description: `Duress Mode Activated: Fake credentials in use.`,
      });
      downloadOriginalData();
    } catch (error) {
      console.error("Error activating duress mode:", error);
    }
  };

  const handleDuressDeactivation = async () => {
    if (confirmPassword !== isDuressSet) {
      setValidationError("Invalid duress password");
      return;
    }
    if (!selectedFile) {
      setValidationError("Please upload the original data file");
      return;
    }
    try {
      const fileText = await selectedFile.text();
      const originalData = JSON.parse(fileText);

      for (const item of originalData) {
        const docRef = doc(db, "credentials", item.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          await updateDoc(docRef, {
            ...item,
            duress: false,
            safe: true,
            modifiedAt: new Date(),
          });
        } else {
          await setDoc(docRef, { ...item });
        }
      }

      const userDocRef = doc(db, "users", user.id);
      await updateDoc(userDocRef, { duressMode: false });

      setDuressMode(false);
      setValidationError("");
      setSelectedFile(null);
      toast({
        title: "Duress Mode Deactivated:",
        variant: "default",
        description: `Original credentials restored.`,
      });
    } catch (error) {
      console.error("Error deactivating duress mode:", error);
      toast({
        title: "Duress Mode Deactivitation Failed:",
        variant: "destructive",
        description: `Something went wrong while restoring your credentials.`,
      });
    }
  };

  const downloadOriginalData = async () => {
    try {
      if (!userEmail) {
        toast({
          title: "Email Not Found:",
          variant: "destructive",
          description: `Something went wrong while Activating Duress Mode.`,
        });
        return;
      }

      const q = query(
        collection(db, "credentials"),
        where("userEmail", "==", userEmail)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast({
          title: "No credentials found",
          variant: "destructive",
          description: `No credentials found for this user.`,
        });
        return;
      }

      const originalData = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        originalData.push({ id: docSnap.id, ...data });

        const fakePassword = generateFakePassword();

        await updateDoc(doc(db, "credentials", docSnap.id), {
          password: fakePassword,
          duress: true,
        });
      }

      const blob = new Blob([JSON.stringify(originalData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "original_credentials.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Duress mode error:", err);
      toast({
        title: "Failed to activate ",
        variant: "destructive",
        description: `Something went wrong while Activating Duress Mode.`,
      });
    }
  };

  return (
    <>
      <DashboardNavbar />
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="w-full max-w-3xl">
          <Card className="shadow-lg border-shadow-purple/40">
            <CardHeader className="bg-shadow-purple/10 bg-opacity-30 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {duressMode ? (
                    <ShieldOff className="h-6 w-6 text-destructive animate-pulse-slow" />
                  ) : (
                    <Shield className="h-6 w-6 text-shadow-purple" />
                  )}
                  <CardTitle className="text-2xl font-bold">
                    Duress Mode
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="duress-toggle"
                    className={
                      duressMode ? "text-destructive" : "text-gray-600 dark:text-gray-200"
                    }
                  >
                    {duressMode ? "Active" : "Inactive"}
                  </Label>
                  <Switch
                    id="duress-toggle"
                    checked={duressMode}
                    disabled={true}
                    className={duressMode ? "bg-destructive" : "bg-gray-700 dark:bg-gray-200"}
                  />
                </div>
              </div>
              <CardDescription className="mt-2">
                {duressMode ? (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span>
                      Duress mode is active. Your real credentials are hidden.
                    </span>
                  </div>
                ) : (
                  "Protect your sensitive data in emergency situations."
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="activate">
                    Activate Duress Mode
                  </TabsTrigger>
                  <TabsTrigger value="deactivate" disabled={!duressMode}>
                    Deactivate Duress Mode
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="activate">
                  {duressMode ? (
                    <div className="space-y-6">
                      <div className="rounded-md bg-duress-light bg-opacity-30 p-4">
                        <h3 className="font-medium flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                          <span>Duress Mode is Active</span>
                        </h3>
                        <p className="text-sm text-gray-600">
                          Your original credentials have been replaced with fake
                          data. To restore your original data, switch to the
                          "Deactivate Duress Mode" tab.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Original Data</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Your original credentials have been automatically
                          downloaded to your device. Keep this file secure as
                          you will need it to deactivate duress mode later.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="rounded-md bg-amber-50 p-4">
                        <h3 className="font-medium flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                          <span>Important</span>
                        </h3>
                        <p className="text-sm text-gray-600">
                          Activating duress mode will replace your real
                          credentials with fake data. Your original data will be
                          automatically downloaded for safekeeping.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-medium">Enter Duress Password</h3>
                        <div className="space-y-2">
                          <div className="relative">
                            <Input
                              type="password"
                              placeholder="Enter your duress password"
                              value={duressPassword}
                              onChange={(e) =>
                                setDuressPassword(e.target.value)
                              }
                              className={
                                validationError ? "border-red-500" : ""
                              }
                            />
                            <Lock className="h-4 w-4 absolute right-3 top-3 text-gray-400" />
                          </div>
                          {validationError && (
                            <p className="text-xs text-red-500">
                              {validationError}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={handleDuressActivation}
                        className="w-full bg-shadow-purple hover:bg-shadow-purple/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!duressPassword}
                      >
                        <Shield className="mr-2 h-4 w-4 text-white" />
                        Activate Duress Mode
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="deactivate">
                  <div className="space-y-6">
                    <div className="rounded-md bg-amber-50 p-4">
                      <h3 className="font-medium flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <span>Restore Original Data</span>
                      </h3>
                      <p className="text-sm text-gray-600">
                        To deactivate duress mode, you need your original data
                        file and duress password.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="file-upload">
                          Upload Original Data File
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <input
                            id="file-upload"
                            type="file"
                            accept=".json"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex flex-col items-center justify-center"
                          >
                            {selectedFile ? (
                              <>
                                <FileText className="h-8 w-8 text-duress mb-2" />
                                <span className="text-sm text-gray-600">
                                  {selectedFile.name}
                                </span>
                              </>
                            ) : (
                              <>
                                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-600">
                                  Click to upload original data file
                                </span>
                              </>
                            )}
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          Confirm Duress Password
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Enter your duress password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={validationError ? "border-red-500" : ""}
                        />
                        {validationError && (
                          <p className="text-xs text-red-500">
                            {validationError}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={handleDuressDeactivation}
                      className="w-full bg-shadow-purple hover:bg-shadow-purple/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!selectedFile || !confirmPassword}
                    >
                      <Shield className="mr-2 h-4 w-4 text-shadow-purple" />
                      Deactivate Duress Mode & Restore Data
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 bg-gray-50 rounded-b-lg">
              <h4 className="text-sm font-medium">About Duress Mode</h4>
              <p className="text-xs text-gray-600">
                Duress mode is designed to protect your sensitive data in
                situations where you are forced to reveal your credentials. When
                activated, it replaces your real credentials with fake ones. To
                restore your original data, you'll need the downloaded file and
                your duress password.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DuressMode;
