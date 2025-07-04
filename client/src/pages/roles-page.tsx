import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Shield, Users, Settings, History } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/lib/api-client";
import { AuditLogViewer } from "@/components/audit-log-viewer";

interface Role {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export default function RolesPage() {
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      try {
        const response = await fetch('/api/roles', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Roles fetch failed: ${response.status}`);
        }
        
        const data = await response.json();
        return data || [];
      } catch (error) {
        console.error('Roles fetch error:', error);
        return [];
      }
    }
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Role Management</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </div>

      <Tabs defaultValue="management" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="management" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Role Management
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Audit Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="management" className="space-y-6">
          {/* Role Statistics */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{roles.length}</div>
                <p className="text-xs text-muted-foreground">
                  Defined user roles
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{roles.filter((role: Role) => role.isActive).length}</div>
                <p className="text-xs text-muted-foreground">
                  Currently active roles
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Roles</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{roles.filter((role: Role) => role.name.includes('Admin')).length}</div>
                <p className="text-xs text-muted-foreground">
                  Administrative roles
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Roles Table */}
          <Card>
            <CardHeader>
              <CardTitle>Role Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role: Role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.description || 'No description'}</TableCell>
                      <TableCell>
                        <Badge variant={role.isActive ? "default" : "secondary"}>
                          {role.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(role.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Permissions</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Role Management Audit Logs</h3>
              <p className="text-muted-foreground">
                View all audit trails for role management operations
              </p>
            </div>
            
            <AuditLogViewer 
              title="Role Management Audit Logs" 
              tableName="roles"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}