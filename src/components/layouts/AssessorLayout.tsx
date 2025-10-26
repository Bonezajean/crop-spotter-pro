import { Link, Outlet, useLocation } from "react-router-dom";
import { Home, Scan, Satellite, FileWarning, Leaf, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AssessorLayout = () => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/assessor/dashboard", icon: Home },
    { name: "Risk Assessment", href: "/assessor/risk-assessment", icon: Scan },
    { name: "Crop Monitoring", href: "/assessor/crop-monitoring", icon: Satellite },
    { name: "Loss Assessment", href: "/assessor/loss-assessment", icon: FileWarning },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/assessor/dashboard" className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-sidebar-foreground">AgriGuard</h1>
              <p className="text-xs text-muted-foreground">Assessor Portal</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} to={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive(item.href)
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-sidebar-foreground">John Assessor</p>
              <p className="text-xs text-muted-foreground">Field Agent</p>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline" className="w-full justify-start gap-2" size="sm">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AssessorLayout;
