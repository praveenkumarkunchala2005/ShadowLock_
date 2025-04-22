
import { Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";
import { useClerk,UserButton } from "@clerk/clerk-react";

const DashboardNavbar = () => {
  const { signOut } = useClerk();
  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/"; 
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };
  return (
    <nav className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-shadow-purple" />
          <span className="font-bold text-xl">ShadowLock</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "36px",
                    height: "36px",
                  },
                },
              }}
            />
          <Link to="/">
            <Button onClick={handleSignOut} variant="outline" className="flex items-center gap-2 ml-2">
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
