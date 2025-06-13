
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Oops! 🌸",
        description: "Please fill in all fields, sweet reader!",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch 💔",
        description: "Your passwords don't match. Please try again!",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short 🔒",
        description: "Please choose a password with at least 6 characters.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // For now, we'll simulate registration and store in localStorage
    // In a real app, this would connect to your backend
    try {
      const users = JSON.parse(localStorage.getItem("readroom_users") || "[]");
      
      // Check if user already exists
      if (users.find((user: any) => user.email === formData.email)) {
        toast({
          title: "Account Exists 📚",
          description: "This email is already registered. Try logging in instead!",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Add new user
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        password: formData.password, // In real app, this would be hashed
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem("readroom_users", JSON.stringify(users));
      localStorage.setItem("readroom_current_user", JSON.stringify(newUser));

      toast({
        title: "Welcome to ReadRoom! 🎉",
        description: "Your account has been created successfully!"
      });

      navigate("/chat");
    } catch (error) {
      toast({
        title: "Something went wrong 😔",
        description: "Please try again later.",
        variant: "destructive"
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-peach-50 to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-pink-600 font-serif">
            <Book className="w-8 h-8" />
            ReadRoom
          </Link>
          <p className="text-gray-600 mt-2">Join our cozy book community! 📚</p>
        </div>

        <Card className="bg-white/80 backdrop-blur border-pink-100 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Create Account</CardTitle>
            <CardDescription className="text-gray-600">
              Start your reading journey with us ✨
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your lovely name"
                  className="mt-1 border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="mt-1 border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    className="border-pink-200 focus:border-pink-400 focus:ring-pink-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="border-pink-200 focus:border-pink-400 focus:ring-pink-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-lg py-3 font-medium"
              >
                {isLoading ? "Creating Account..." : "Join ReadRoom 💕"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-pink-600 hover:text-pink-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
