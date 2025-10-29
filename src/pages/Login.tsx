import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCheck, Tractor, Shield, Leaf } from "lucide-react";

type UserRole = "assessor" | "farmer" | "admin" | null;

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const roles = [
    {
      id: "assessor" as const,
      title: "Field Assessor",
      description: "Conduct field assessments and risk analysis",
      icon: UserCheck,
      route: "/assessor/dashboard",
    },
    {
      id: "farmer" as const,
      title: "Farmer",
      description: "View your fields and assessment reports",
      icon: Tractor,
      route: "/farmer/dashboard",
    },
    {
      id: "admin" as const,
      title: "Administrator",
      description: "Manage policies, claims, and analytics",
      icon: Shield,
      route: "/admin/dashboard",
    },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      const role = roles.find((r) => r.id === selectedRole);
      if (role) {
        navigate(role.route);
      }
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Leaf className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold text-gradient">AgriGuard Platform</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Advanced Agricultural Insurance & Risk Management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {roles.map((role) => (
              <Card
                key={role.id}
                className="cursor-pointer card-hover border-2 hover:border-primary transition-all"
                onClick={() => setSelectedRole(role.id)}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                    <role.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{role.title}</CardTitle>
                  <CardDescription className="text-base">{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Select Role
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const selectedRoleData = roles.find((r) => r.id === selectedRole);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            {selectedRoleData && <selectedRoleData.icon className="h-6 w-6 text-primary" />}
          </div>
          <CardTitle className="text-2xl">Sign In as {selectedRoleData?.title}</CardTitle>
          <CardDescription>Enter your credentials to access the portal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setSelectedRole(null)} className="flex-1">
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Sign In
              </Button>
            </div>
          </form>
          
          <div className="text-center text-sm text-muted-foreground mt-4 pt-4 border-t border-border">
            Don't have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-primary"
              onClick={() => navigate("/register")}
            >
              Register here
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
