import { Shield,LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";
import { useUser, UserButton,useClerk } from "@clerk/clerk-react";

const Navbar = () => {
  const { isSignedIn } = useUser();
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
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-shadow-purple" />
          <span className="font-bold text-xl">ShadowLock</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#security"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Security
          </a>
          <a
            href="#testimonials"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Testimonials
          </a>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!isSignedIn ? (
            <Link to="/sign-in">
              <Button variant="outline" className="hidden sm:flex ml-2">
                Sign In
              </Button>
            </Link>
          ) : (
            <></>
          )}
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
          {isSignedIn ? (
            <Link to="/">
              <Button onClick={handleSignOut} variant="outline" className="flex items-center gap-2 ml-2">
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </Link>
          ) : (
            <></>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
