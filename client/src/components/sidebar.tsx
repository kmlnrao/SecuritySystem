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
  "Administration": Settings,
  "Security": Shield
};

export function Sidebar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  // Fetch user navigation structure based on permissions
  const { data: navigation = [], isLoading } = useQuery<NavigationItem[]>({
    queryKey: ["navigation", user?.id, "v2"],
    queryFn: async () => {
      if (!user?.id) return [];
      
      try {
        const response = await fetch(`/api/users/${user.id}/navigation`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Navigation fetch failed: ${response.status}`);
        }
        
        const data = await response.json();
        return data || [];
      } catch (error) {
        console.error('Navigation fetch error:', error);
        return [];
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
          {/* Hospital Modules */}
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
                    // Map document paths to dashboard views for certain admin paths
                    const pathToViewMap: Record<string, string> = {
                      '/dashboard': 'dashboard',
                      '/admin/users': 'users',
                      '/admin/roles': 'roles',
                      '/modules': 'modules',
                      '/documents': 'documents',
                      '/permissions': 'permissions',
                      '/module-documents': 'module-documents',
                    };
                    
                    const isDashboardView = pathToViewMap[document.path];
                    
                    if (isDashboardView) {
                      // For dashboard views (admin sections)
                      return (
                        <Button
                          key={document.id}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-xs transition-colors text-slate-400 hover:text-white hover:bg-slate-700/50"
                          onClick={() => {
                            const view = pathToViewMap[document.path];
                            (window as any).setDashboardView?.(view);
                          }}
                        >
                          {document.name === 'Dashboard' && <BarChart3 className="h-4 w-4 mr-2" />}
                          {document.name}
                          {document.name !== 'Dashboard' && (
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
                          )}
                        </Button>
                      );
                    } else {
                      // For regular navigation to document content within dashboard
                      return (
                        <Button
                          key={document.id}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-xs transition-colors text-slate-400 hover:text-white hover:bg-slate-700/50"
                          onClick={() => {
                            (window as any).setDocumentContent?.(document.name, document.path);
                          }}
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
                      );
                    }
                  })}
                </div>
              </div>
            );
          })}
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
