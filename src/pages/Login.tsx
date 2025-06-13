
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
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
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information 🌸",
        description: "Please enter both email and password!",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem("readroom_users") || "[]");
      const user = users.find((u: any) => u.email === formData.email && u.password === formData.password);

      if (user) {
        localStorage.setItem("readroom_current_user", JSON.stringify(user));
        toast({
          title: "Welcome back! 📚",
          description: `Hi ${user.name}! Ready to discover some amazing books?`
        });
        navigate("/chat");
      } else {
        toast({
          title: "Login Failed 💔",
          description: "Invalid email or password. Please try again!",
          variant: "destructive"
        });
      }
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
          <p className="text-gray-600 mt-2">Welcome back, book lover! 💕</p>
        </div>

        <Card className="bg-white/80 backdrop-blur border-pink-100 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Sign In</CardTitle>
            <CardDescription className="text-gray-600">
              Ready to chat about books? ✨
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="Your password"
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

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-lg py-3 font-medium"
              >
                {isLoading ? "Signing In..." : "Sign In 💕"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                New to ReadRoom?{" "}
                <Link to="/register" className="text-pink-600 hover:text-pink-700 font-medium">
                  Create an account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
