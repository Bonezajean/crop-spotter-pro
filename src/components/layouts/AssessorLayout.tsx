import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Home, Scan, Satellite, FileWarning, Leaf, User, LogOut, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AssessorLayout = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

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
      <aside 
        className={cn(
          "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <Link to="/assessor/dashboard" className={cn("flex items-center gap-2", collapsed && "justify-center")}>
            <Leaf className="h-8 w-8 text-primary flex-shrink-0" />
            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold text-sidebar-foreground">Starhawk</h1>
                <p className="text-xs text-muted-foreground">Assessor Portal</p>
              </div>
            )}
          </Link>
        </div>

        {/* Collapse Toggle */}
        <div className="px-2 py-2 border-b border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn("w-full", collapsed ? "justify-center px-2" : "justify-end")}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.name} to={item.href} className="relative block" title={collapsed ? item.name : undefined}>
                {active && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r" />
                )}
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full relative",
                    collapsed ? "justify-center px-2" : "justify-start gap-3",
                    active
                      ? "bg-transparent text-primary hover:bg-transparent"
                      : "text-sidebar-foreground hover:bg-sidebar-border hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-2 border-t border-sidebar-border">
          <div className={cn("flex items-center gap-3 mb-3 p-2", collapsed && "justify-center")}>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-primary" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">John Assessor</p>
                <p className="text-xs text-muted-foreground truncate">Field Agent</p>
              </div>
            )}
          </div>
          <Link to="/">
            <Button 
              variant="outline" 
              className={cn("w-full", collapsed ? "justify-center px-2" : "justify-start gap-2")} 
              size="sm"
              title={collapsed ? "Logout" : undefined}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!collapsed && "Logout"}
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
