
import { useState } from "react";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";

const categories = ["Email", "Banking", "Social", "Work", "Shopping", "Entertainment", "Development", "Other"];

// Define the proper TypeScript interface for password items
interface PasswordItem {
  id?: number;
  title: string;
  username: string;
  password: string;
  website: string;
  category: string;
}

interface PasswordFormProps {
  initialData?: Partial<PasswordItem>;
  onSubmit: (data: PasswordItem) => void;
  onCancel: () => void;
}

const PasswordForm = ({ initialData = {}, onSubmit, onCancel }: PasswordFormProps) => {
  const [formData, setFormData] = useState<PasswordItem>({
    title: "",
    username: "",
    password: "",
    website: "",
    category: "Other",
    ...initialData
  });
  
  const [showPassword, setShowPassword] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const generatePassword = () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=";
    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }
    setFormData({ ...formData, password: generatedPassword });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Gmail, Facebook, Bank"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="username">Username/Email</Label>
        <Input
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="username or email@example.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={generatePassword}
            className="gap-2"
          >
            <RefreshCw size={16} />
            <span className="hidden sm:inline">Generate</span>
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="website">Website URL</Label>
        <Input
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          placeholder="https://example.com"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      
      <DialogFooter className="pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-shadow-purple hover:bg-shadow-purple/90">
          {initialData.id ? "Update" : "Add"} Password
        </Button>
      </DialogFooter>
    </form>
  );
};

export default PasswordForm;
