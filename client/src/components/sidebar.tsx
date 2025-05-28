import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Hospital, BarChart3, Users, Shield, Puzzle, FileText, Settings, LogOut } from "lucide-react";

export function Sidebar() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logoutMutation.mutate();
    }
  };

  const getInitials = (email: string) => {
    return email?.split("@")[0].substring(0, 2).toUpperCase() || "AD";
  };

  const navigation = [
    { name: "Dashboard", icon: BarChart3, active: true },
    { name: "User Management", icon: Users, active: false },
    { name: "Roles & Permissions", icon: Shield, active: false },
    { name: "Modules", icon: Puzzle, active: false },
    { name: "Documents", icon: FileText, active: false },
  ];

  return (
    <div className="w-64 bg-primary text-white flex-shrink-0 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <Hospital className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">HMS Admin</h1>
            <p className="text-slate-400 text-sm">Authentication System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1">
        <div className="px-6 mb-6">
          <h3 className="text-slate-400 text-xs uppercase tracking-wider font-medium">Main Menu</h3>
        </div>
        
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.name}
                variant="ghost"
                className={`w-full justify-start px-6 py-3 text-left font-medium transition-colors ${
                  item.active
                    ? "text-white bg-accent/20 border-r-2 border-accent hover:bg-accent/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </Button>
            );
          })}
        </div>

        <div className="px-6 mt-8 mb-4">
          <h3 className="text-slate-400 text-xs uppercase tracking-wider font-medium">System</h3>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start px-6 py-3 text-left font-medium text-slate-300 hover:text-white hover:bg-slate-700/50"
        >
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </Button>
      </nav>

      {/* User Profile */}
      <div className="p-6 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {getInitials(user?.email || "")}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{user?.username || "Admin"}</p>
            <p className="text-slate-400 text-xs">System Administrator</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white p-1"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
