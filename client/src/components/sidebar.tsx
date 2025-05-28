import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Hospital, BarChart3, Users, Shield, Puzzle, FileText, Settings, LogOut, Stethoscope, Calendar, Activity, Database, TestTube, Pill } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { permissionService } from "@/lib/api-client";
import { Link, useLocation } from "wouter";

type NavigationItem = {
  id: string;
  name: string;
  documents: Array<{
    id: string;
    name: string;
    path: string;
    permissions: {
      canAdd: boolean;
      canModify: boolean;
      canDelete: boolean;
      canQuery: boolean;
    };
  }>;
};

const moduleIcons: Record<string, any> = {
  "Patient Management": Users,
  "Medical Records": FileText,
  "Appointments": Calendar,
  "Pharmacy": Pill,
  "Laboratory": TestTube,
  "Administration": Settings
};

export function Sidebar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  // Fetch user navigation structure from permission service
  const { data: navigation = [] } = useQuery<NavigationItem[]>({
    queryKey: ["navigation", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      try {
        const response = await permissionService.getUserNavigation(user.id);
        return response.data;
      } catch (error) {
        console.error('Navigation fetch error:', error);
        return [];
      }
    },
    enabled: !!user?.id,
  });

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logoutMutation.mutate();
    }
  };

  const getInitials = (email: string) => {
    return email?.split("@")[0].substring(0, 2).toUpperCase() || "AD";
  };

  return (
    <div className="w-64 bg-primary text-white flex-shrink-0 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Hospital System</h1>
            <p className="text-slate-400 text-sm">Management Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 overflow-y-auto">
        <div className="px-6 mb-6">
          <h3 className="text-slate-400 text-xs uppercase tracking-wider font-medium">Hospital Modules</h3>
        </div>
        
        <div className="space-y-4">
          {navigation.map((module) => {
            const Icon = moduleIcons[module.name] || FileText;
            
            return (
              <div key={module.id} className="px-6">
                <div className="flex items-center text-sm font-medium text-slate-300 mb-2">
                  <Icon className="h-4 w-4 mr-2" />
                  {module.name}
                </div>
                
                <div className="ml-6 space-y-1">
                  {module.documents.map((document) => {
                    const isActive = location === document.path;
                    
                    return (
                      <Link key={document.id} href={document.path}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`w-full justify-start text-xs transition-colors ${
                            isActive
                              ? "text-white bg-accent/20 border-r-2 border-accent hover:bg-accent/30"
                              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                          }`}
                        >
                          {document.name}
                          <div className="ml-auto flex space-x-1">
                            {document.permissions.canAdd && (
                              <span className="text-xs text-green-400">+</span>
                            )}
                            {document.permissions.canModify && (
                              <span className="text-xs text-blue-400">✎</span>
                            )}
                            {document.permissions.canDelete && (
                              <span className="text-xs text-red-400">×</span>
                            )}
                          </div>
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Default Dashboard Link */}
        <div className="px-6 mt-6">
          <Link href="/">
            <Button
              variant="ghost"
              className={`w-full justify-start px-0 py-3 text-left font-medium transition-colors ${
                location === "/"
                  ? "text-white bg-accent/20 border-r-2 border-accent hover:bg-accent/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <BarChart3 className="h-5 w-5 mr-3" />
              Dashboard
            </Button>
          </Link>
        </div>
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
