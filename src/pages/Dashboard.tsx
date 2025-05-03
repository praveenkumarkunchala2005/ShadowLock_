import { useState, useEffect } from "react";
import { Shield, Plus, Search, Clipboard, Eye, EyeOff, Edit, Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import DashboardNavbar from "@/components/DashboardNavbar";
import PasswordForm from "@/components/PasswordForm";
import PasswordDetailModal from "@/components/PasswordDetailModal";
import { useUser } from "@clerk/clerk-react";
import { collection, query, where, onSnapshot, getDoc } from "firebase/firestore";
import { doc, setDoc,deleteDoc,updateDoc } from "firebase/firestore";
import { db } from "../Service/firebase";
import CryptoJS from "crypto-js";
import { encrypt,decrypt } from "@/Service/crypto";

type NewPassword = {
  title: string;
  category: string;
  website: string;
  username: string;
  password: string;
};


const Dashboard = () => {
  const { user, isLoaded, isSignedIn } = useUser()
  const [passwords, setPasswords] = useState([]);
  const [isDuressSet, setIsDuressSet] = useState<string | null>(null)
  const [duressMode, setDuressMode] = useState(false);
  //   () => {
  //   const savedPasswords = localStorage.getItem("shadowlock-passwords");
  //   return savedPasswords ? JSON.parse(savedPasswords) : [
  //     { id: 1, title: "Gmail", username: "user@gmail.com", password: "securePass123", website: "https://gmail.com", category: "Email" },
  //     { id: 2, title: "GitHub", username: "devuser", password: "devPass456!", website: "https://github.com", category: "Development" },
  //     { id: 3, title: "Netflix", username: "moviebuff", password: "Netflix789#", website: "https://netflix.com", category: "Entertainment" },
  //   ];
  // });
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
    // useEffect(() => {
    //   const checkDuress = async () => {
    //     if (!isSignedIn || !user) return;
    //     try {
    //       const docRef = doc(db, "users", user.id);
    //       const docSnap = await getDoc(docRef);
  
    //       if (docSnap.exists()) {
    //         const data = docSnap.data();
    //         setDuressMode(data?.duressMode || false);
    //       } else {
    //         setDuressMode(false);
    //       }
    //     } catch (error) {
    //       console.error("Error fetching duress password:", error);
    //       setDuressMode(false);
    //     }
    //   };
    //   checkDuress();
    // }, [user, isSignedIn]);
    const decryptPasswords = async () => {
      const updatedPasswords = await Promise.all(
        passwords.map(async (password) => {
          if (password.password) {
            try {
              if(password.password.split(':').length === 3){
                const decryptedPassword = await decrypt(password.password, isDuressSet);
                console.log("Decrypted password:", password.password);
                return {
                  ...password,
                  password: decryptedPassword,
                };
              } else {
                console.log("decryption no need");
              }
            } catch (error) {
              console.error("Error decrypting password:", error);
              return password;
            }
          }
          return password;
        })
      );
      setPasswords(updatedPasswords); 
    };
    
    
    useEffect(() => {
      let unsubscribe: (() => void) | undefined;
    
      const getData = async () => {
        try {
          if (!db) {
            console.error("Firestore is not initialized.");
            return;
          }
    
          if (isLoaded && user) {
            const userEmail = user.primaryEmailAddress?.emailAddress;
    
            if (userEmail) {
              const q = query(
                collection(db, "credentials"),
                where("userEmail", "==", userEmail)
              );
              unsubscribe = onSnapshot(q, (querySnapshot) => {
                const fetchedData = querySnapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }));
                setPasswords(fetchedData);
                console.log("UserData updated:", fetchedData);
              });
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      getData();
    
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }, [user, isLoaded]);
    
    useEffect(() => {
      if (passwords.length > 0) {
        decryptPasswords();
      }
    }, [passwords]);
    

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailPassword, setDetailPassword] = useState(null);
  const { toast } = useToast();
  const [addCredentialSave, setaddCredentialSave] = useState(false);
  const [isBreached, setIsBreached] = useState(false);

  useEffect(() => {
    const checkPasswordBreaches = async () => {
      if (detailPassword) {
        const breached = await isPasswordBreached(detailPassword);
        setIsBreached(breached);
      }
    };
    checkPasswordBreaches();
  }
  , [detailPassword]);

  useEffect(() => {
    localStorage.setItem("shadowlock-passwords", JSON.stringify(passwords));
  }, [passwords]);

  const savePassword = async (
    newPassword: NewPassword,
    docId: string,
    userEmail: string
  ) => {
    await setDoc(doc(db, "credentials", docId), {
      title: newPassword.title,
      category: newPassword.category,
      website: newPassword.website,
      username: newPassword.username,
      password: newPassword.password,
      safe: true,
      createdAt: new Date(),
      modifiedAt: new Date(),
      userEmail,
      id: docId,
    });
  };
  const handleAddPassword = async (newPassword) => {
    setaddCredentialSave(true);
    const docId = Date.now().toString();
  
    try {
      // Wait for the password to be encrypted
      const encryptedPassword = await encrypt(newPassword.password, isDuressSet);
      newPassword.password = encryptedPassword;
  
      // Save to Firestore
      await savePassword(newPassword, docId, user.primaryEmailAddress?.emailAddress);
      console.log("done successfully");
  
      toast({
        title: "Password Added",
        variant: "default",
        description: `${newPassword.title} has been added to your vault.`,
      });
    } catch (error) {
      toast({
        title: "Password Adding Failed",
        variant: "destructive",
        description: `${newPassword.title} failed to add.`,
      });
      console.error("Error adding document: ", error);
    }
  
    setaddCredentialSave(false);
    setIsAddOpen(false);
  };
  

  const handleEditPassword = async (updatedPassword) => {
    try {
      const encrypted = await encrypt(updatedPassword.password, isDuressSet);
      const docRef = doc(db, "credentials", currentPassword.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const oldData = docSnap.data();

        const encrypted = await encrypt(updatedPassword.password, isDuressSet);

        await updateDoc(docRef, {
          ...oldData,
          password: encrypted,
          modifiedAt: new Date(),
        });
      }
      toast({
        title: "Password Updated",
        description: `${updatedPassword.title} has been updated.`,
      });
    } catch (error) {
      toast({
        title: "Password Update Failed",
        variant: "destructive",
        description: `${updatedPassword.title} failed to update.`,
      });
      console.error("Error updating document: ", error);
    }
    setIsEditOpen(false);
  };

  const handleDeletePassword = async (id) => {
    const docRef = doc(db, "credentials", id);
    await deleteDoc(docRef);
    toast({
      title: "Password Deleted",
      description: `Password Deleted has been removed from your vault.`,
      variant: "destructive",
    });
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: `${type} has been copied to clipboard.`,
    });
  };

  const filteredPasswords = passwords.filter(p => 
    (typeof p.title === 'string' && p.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (typeof p.username === 'string' && p.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (typeof p.website === 'string' && p.website.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (typeof p.category === 'string' && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  

  const isPasswordReused = (pw) => {
    return passwords.filter(p => p.password === pw.password && p.id !== pw.id).length > 0;
  };

  const isPasswordBreached = async (pw) => {
    const sha1Hash = CryptoJS.SHA1(pw.password)
        .toString(CryptoJS.enc.Hex)
        .toUpperCase();
      const first5 = sha1Hash.slice(0, 5);
      const tail = sha1Hash.slice(5);
      try {
        const response = await fetch(
          `https://api.pwnedpasswords.com/range/${first5}`
        );
        const data = await response.text();

        const found = data
          .split("\n")
          .some((line) => line.split(":")[0] === tail);
        return found;
      } catch (error) {
        return false;
      }
  };
  

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      
      <main className="container mx-auto px-4 py-24 max-w-7xl">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold">Password Vault</h1>
          <div className="flex items-center gap-4">
          <a href="/duressMode">
          <Button 
            className="flex items-center gap-2 bg-shadow-purple hover:bg-shadow-purple/90 btn-hover-effect"
          >
            <Plus size={18} />
            Duress Mode
          </Button>
          </a>
          <Button 
            disabled={duressMode}
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 bg-shadow-purple hover:bg-shadow-purple/90 btn-hover-effect"
          >
            <Plus size={18} />
            Add Password
          </Button>
          </div>
        </div>

        <Card className="mb-8 overflow-hidden animate-fade-in" style={{animationDelay: "0.1s"}}>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search passwords..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden animate-fade-in" style={{animationDelay: "0.2s"}}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPasswords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No passwords found. Add your first password to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPasswords.map((item, index) => (
                    <TableRow 
                      key={item.id}
                      className="animate-fade-in hover:bg-muted/50 transition-colors cursor-pointer"
                      style={{animationDelay: `${0.3 + index * 0.05}s`}}
                      onClick={() => {
                        setDetailPassword(item);
                        setIsDetailOpen(true);
                      }}
                    >
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.username}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={e => {
                              e.stopPropagation();
                              copyToClipboard(item.username, "Username");
                            }}
                          >
                            <Clipboard size={16} />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">
                            {visiblePasswords[item.id] ? item.password : '•'.repeat(8)}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={e => {
                              e.stopPropagation();
                              togglePasswordVisibility(item.id);
                            }}
                          >
                            {visiblePasswords[item.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={e => {
                              e.stopPropagation();
                              copyToClipboard(item.password, "Password");
                            }}
                          >
                            <Clipboard size={16} />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.website && (
                          <a 
                            href={item.website.startsWith('http') ? item.website : `https://${item.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-shadow-purple hover:underline"
                            onClick={e => e.stopPropagation()}
                          >
                            {item.website}
                          </a>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-xs">
                          {item.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8" 
                            onClick={e => {
                              e.stopPropagation();
                              setCurrentPassword(item);
                              setIsEditOpen(true);
                            }}
                            disabled={duressMode}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-destructive" 
                            onClick={e => {
                              e.stopPropagation();
                              handleDeletePassword(item.id);
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Password</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new password to your vault.
            </DialogDescription>
          </DialogHeader>
          <PasswordForm 
            onSubmit={handleAddPassword} 
            onCancel={() => setIsAddOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Password</DialogTitle>
            <DialogDescription>
              Update the details for this password entry.
            </DialogDescription>
          </DialogHeader>
          {currentPassword && (
            <PasswordForm 
              initialData={currentPassword}
              onSubmit={handleEditPassword} 
              onCancel={() => setIsEditOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <PasswordDetailModal
        open={isDetailOpen}
        onOpenChange={open => setIsDetailOpen(open)}
        password={detailPassword}
        isReused={detailPassword ? isPasswordReused(detailPassword) : true}
        isBreached={isBreached}
      />
    </div>
  );
};

export default Dashboard;
