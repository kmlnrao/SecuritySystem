import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Eye, Trash2, Search, Plus, History, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { AuditLogViewer } from "./audit-log-viewer";

interface Permission {
  id: string;
  entityType: string;
  entityId: string;
  documentId: string;
  canAdd: boolean;
  canModify: boolean;
  canDelete: boolean;
  canQuery: boolean;
  createdAt: string;
}

export function PermissionManagementTableWithAudit() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [editPermissionOpen, setEditPermissionOpen] = useState(false);
  const [viewPermissionOpen, setViewPermissionOpen] = useState(false);
  const { toast } = useToast();

  const { data: permissions = [], isLoading } = useQuery<Permission[]>({ 
    queryKey: ["permissions"]
  });

  const deleteMutation = useMutation({
    mutationFn: async (permissionId: string) => {
      const response = await fetch(`/api/permissions/${permissionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete permission');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast({
        title: "Success",
        description: "Permission deleted successfully",
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

  const filteredPermissions = permissions.filter((permission: Permission) => {
    const matchesSearch = permission.entityType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         permission.entityId?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = (permissionId: string) => {
    if (confirm("Are you sure you want to delete this permission?")) {
      deleteMutation.mutate(permissionId);
    }
  };

  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission);
    setEditPermissionOpen(true);
  };

  const handleView = (permission: Permission) => {
    setSelectedPermission(permission);
    setViewPermissionOpen(true);
  };

  const getPermissionLevel = (permission: any) => {
    const permissions = [];
    if (permission.canAdd) permissions.push("Add");
    if (permission.canModify) permissions.push("Modify");
    if (permission.canDelete) permissions.push("Delete");
    if (permission.canQuery) permissions.push("Query");
    return permissions.join(", ") || "None";
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading permissions...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="management" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="management" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Permission Management
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
                    placeholder="Search permissions..."
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
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Entity Type</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Entity ID</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Document</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Permissions</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Created</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPermissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        {permissions.length === 0 ? "No permissions found" : `No permissions match your search. Total permissions: ${permissions.length}`}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPermissions.map((permission: any) => (
                      <TableRow key={permission.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium">{permission.entityType}</TableCell>
                        <TableCell className="text-sm text-slate-500">{permission.entityId}</TableCell>
                        <TableCell className="text-sm text-slate-500">{permission.documentId}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {permission.canAdd && <Badge variant="outline" className="text-xs">Add</Badge>}
                            {permission.canModify && <Badge variant="outline" className="text-xs">Modify</Badge>}
                            {permission.canDelete && <Badge variant="outline" className="text-xs">Delete</Badge>}
                            {permission.canQuery && <Badge variant="outline" className="text-xs">Query</Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {new Date(permission.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-accent hover:text-blue-600"
                              onClick={() => handleEdit(permission)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-slate-400 hover:text-slate-600"
                              onClick={() => handleView(permission)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-400 hover:text-red-600"
                              onClick={() => handleDelete(permission.id)}
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
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPermissions.length}</span> of <span className="font-medium">{permissions.length}</span> results
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Permission Management Audit Logs</h3>
              <p className="text-muted-foreground">
                View all audit trails for permission management operations
              </p>
            </div>
            
            <AuditLogViewer 
              title="Permission Management Audit Logs" 
              tableName="permissions"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}