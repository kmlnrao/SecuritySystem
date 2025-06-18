import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Eye, Trash2, Search, Plus, History, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { AuditLogViewer } from "./audit-log-viewer";
import { EditRoleDialog, ViewRoleDialog } from "./role-dialogs";


interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export function RoleManagementTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editRoleOpen, setEditRoleOpen] = useState(false);
  const [viewRoleOpen, setViewRoleOpen] = useState(false);
  const { toast } = useToast();

  const { data: roles = [], isLoading } = useQuery<Role[]>({ 
    queryKey: ["roles"]
  });

  const deleteMutation = useMutation({
    mutationFn: async (roleId: string) => {
      const response = await fetch(`/api/roles/${roleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete role');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredRoles = roles.filter((role: any) => {
    const matchesSearch = role.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = (roleId: string) => {
    if (confirm("Are you sure you want to delete this role?")) {
      deleteMutation.mutate(roleId);
    }
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setEditRoleOpen(true);
  };

  const handleView = (role: Role) => {
    setSelectedRole(role);
    setViewRoleOpen(true);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading roles...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="management" className="w-full">
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
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search roles..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Role Name</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Description</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Created</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        {roles.length === 0 ? "No roles found" : `No roles match your search. Total roles: ${roles.length}`}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRoles.map((role: any) => (
                      <TableRow key={role.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>{role.description || 'No description'}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={role.isActive ? "default" : "secondary"}
                            className={role.isActive ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                          >
                            <div className={`w-2 h-2 rounded-full mr-1 ${role.isActive ? "bg-green-500" : "bg-yellow-500"}`} />
                            {role.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {new Date(role.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-accent hover:text-blue-600"
                              onClick={() => handleEdit(role)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-slate-400 hover:text-slate-600"
                              onClick={() => handleView(role)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-400 hover:text-red-600"
                              onClick={() => handleDelete(role.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredRoles.length}</span> of <span className="font-medium">{roles.length}</span> results
                </div>
              </div>
            </div>
          </div>
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

      {/* Role Management Dialogs */}
      <EditRoleDialog 
        role={selectedRole} 
        open={editRoleOpen} 
        onOpenChange={setEditRoleOpen} 
      />
      <ViewRoleDialog 
        role={selectedRole} 
        open={viewRoleOpen} 
        onOpenChange={setViewRoleOpen} 
      />
    </div>
  );
}