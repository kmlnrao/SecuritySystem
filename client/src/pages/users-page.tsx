import { UserManagementTable } from "@/components/user-management-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Shield, Activity, History } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/lib/api-client";
import { AuditLogViewer } from "@/components/audit-log-viewer";

interface User {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
}

export default function UsersPage() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Users fetch failed: ${response.status}`);
        }
        
        const data = await response.json();
        return data || [];
      } catch (error) {
        console.error('Users fetch error:', error);
        return [];
      }
    }
  });

  const activeUsers = users.filter((user: User) => user.isActive);
  const inactiveUsers = users.filter((user: User) => !user.isActive);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Tabs defaultValue="management" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="management" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Audit Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="management" className="space-y-6">
          {/* User Statistics */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">
                  All registered users
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeUsers.length}</div>
                <p className="text-xs text-muted-foreground">
                  Currently active accounts
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inactiveUsers.length}</div>
                <p className="text-xs text-muted-foreground">
                  Disabled accounts
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <UserManagementTable />
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">User Management Audit Logs</h3>
              <p className="text-muted-foreground">
                View all audit trails for user management operations
              </p>
            </div>
            
            <AuditLogViewer 
              title="User Management Audit Logs" 
              tableName="users"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}