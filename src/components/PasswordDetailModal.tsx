
import { useState } from "react";
import { AlertTriangle, Repeat, ShieldCheck, XCircle, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PasswordItem {
  id?: number;
  title: string;
  username: string;
  password: string;
  website: string;
  category: string;
}

interface PasswordDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  password: PasswordItem | null;
  isReused: boolean;
  isBreached: boolean;
}

const PasswordDetailModal = ({
  open,
  onOpenChange,
  password,
  isReused,
  isBreached,
}: PasswordDetailModalProps) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!password) return null;

  const barColor = isBreached
    ? "bg-red-700"
    : isReused
      ? "bg-amber-500"
      : "bg-primary";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg animate-scale-in border-none rounded-2xl p-0 bg-white dark:bg-[#232843] shadow-2xl overflow-hidden"
      >
        {/* Pattern color bar */}
        <div className="relative h-2 w-full overflow-hidden">
          <div className={`h-full w-full transition-colors ${barColor} animate-pulse`} />
        </div>
        <DialogHeader className="px-8 pt-7 pb-3">
          <DialogTitle className="flex items-center gap-3 text-2xl font-extrabold tracking-tight mb-1 text-gray-900 dark:text-white">
            <span>{password.title}</span>
            {isBreached && (
              <AlertTriangle className="ml-1" color="#ea384c" size={28} aria-label="Breached" />
            )}
            {!isBreached && isReused && (
              <Repeat className="ml-1" color="#F97316" size={28} aria-label="Reused" />
            )}
            {!isBreached && !isReused && (
              <ShieldCheck className="ml-1" color="#9b87f5" size={24} aria-label="Secure" />
            )}
          </DialogTitle>
          <DialogDescription>
            <span className="text-base text-muted-foreground">
              Manage and review details for this password.
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-8 py-2 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User/email */}
            <div className="flex flex-col gap-1 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-[#444770] bg-gray-50 dark:bg-[#1A1F2C] transition-colors">
              <span className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Username/Email</span>
              <span className="font-mono text-base break-all select-all text-gray-900 dark:text-gray-300">{password.username}</span>
            </div>
            {/* Website */}
            <div className="flex flex-col gap-1 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-[#444770] bg-gray-50 dark:bg-[#1A1F2C] transition-colors">
              <span className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Website</span>
              <a
                className="story-link text-base underline underline-offset-2 text-primary hover:text-primary-foreground"
                href={password.website.startsWith("http") ? password.website : `https://${password.website}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {password.website}
              </a>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Password with eye toggle */}
            <div className="flex flex-col gap-1 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-[#444770] bg-gray-50 dark:bg-[#1A1F2C] transition-colors">
              <span className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-1">Password</span>
              <div className="relative flex items-center">
                <span
                  className={`font-mono text-lg break-all select-all tracking-wide pr-10 text-gray-900 dark:text-gray-300 ${showPassword ? '' : 'password-dots'}`}
                  style={{ fontFamily: 'monospace' }}
                  aria-label="Password"
                >
                  {showPassword ? password.password : '•'.repeat(8)}
                </span>
                <button
                  type="button"
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-violet-500 focus:outline-none"
                  title={showPassword ? "Hide password" : "Show password"}
                  tabIndex={0}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {/* Category */}
            <div className="flex flex-col gap-1 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-[#444770] bg-yellow-50 dark:bg-yellow-900/50 transition-colors max-w-xs">
              <span className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Category</span>
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full border border-yellow-300 dark:border-yellow-600 w-fit bg-yellow-50 dark:bg-yellow-900/50">{password.category}</span>
            </div>
          </div>
          {/* Warnings */}
          <div className="pt-2 space-y-3 transition-all">
            {isBreached && (
              <div className="flex items-start gap-3 bg-red-100 dark:bg-red-950/70 border-l-4 border-red-600 rounded-xl p-4 animate-fade-in shadow-none">
                <XCircle color="#ea384c" size={28} className="mt-0.5" />
                <div>
                  <div className="font-bold text-destructive text-lg flex items-center">
                    Password Breached!
                  </div>
                  <div className="text-destructive/90 mt-1 text-sm font-medium">
                    This password has appeared in a data breach. Change it <span className="font-bold uppercase tracking-wide">immediately</span> to protect your accounts.
                  </div>
                </div>
              </div>
            )}
            {!isBreached && isReused && (
              <div className="flex items-start gap-3 bg-yellow-50 dark:bg-amber-900/50 border-l-4 border-amber-500 rounded-xl p-4 animate-fade-in shadow-none">
                <Repeat color="#F97316" size={28} className="mt-0.5" />
                <div>
                  <div className="font-bold text-amber-600 text-lg flex items-center">
                    Password Reused!
                  </div>
                  <div className="text-amber-700/90 mt-1 text-sm font-medium">
                    You have used this password for multiple accounts. Please choose a <span className="font-bold">unique password</span> for better security.
                  </div>
                </div>
              </div>
            )}
            {!isBreached && !isReused && (
              <div className="flex items-center gap-3 bg-green-50 dark:bg-emerald-900/50 border-l-4 border-green-600 rounded-xl p-4 animate-fade-in">
                <ShieldCheck color="#22c55e" size={24} />
                <span className="font-semibold text-green-700 dark:text-green-300">This password is unique and safe.</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end px-8 pb-6 pt-3">
          <Button
            variant="outline"
            className="btn-hover-effect"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordDetailModal;

