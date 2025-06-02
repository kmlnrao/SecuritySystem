import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Plus, Trash2, User, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddPermissionDialog, ViewPermissionDialog, EditPermissionDialog } from "./permission-dialogs";
import { apiRequest } from "@/lib/queryClient";

interface Permission {
  id: string;
  userId?: string;
  roleId?: string;
  documentId: string;
  canAdd: boolean;
  canModify: boolean;
  canDelete: boolean;
  canQuery: boolean;
  userName?: string;
  roleName?: string;
  documentName: string;
  documentPath?: string;
}

export function PermissionManagementTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

  const { data: permissions = [], isLoading } = useQuery<Permission[]>({
    queryKey: ["/api/permissions"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (permissionId: string) => {
      await apiRequest("DELETE", `/api/permissions/${permissionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/permissions"] });
      toast({ title: "Permission deleted successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete permission",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (permission: Permission) => {
    if (confirm("Are you sure you want to delete this permission?")) {
      deleteMutation.mutate(permission.id);
    }
  };

  const handleView = (permission: Permission) => {
    setSelectedPermission(permission);
    setViewDialogOpen(true);
  };

  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission);
    setEditDialogOpen(true);
  };

  const getPermissionBadges = (permission: Permission) => {
    const badges = [];
    if (permission.canQuery) badges.push(<Badge key="query" variant="secondary">View</Badge>);
    if (permission.canAdd) badges.push(<Badge key="add" variant="default">Add</Badge>);
    if (permission.canModify) badges.push(<Badge key="modify" variant="outline">Modify</Badge>);
    if (permission.canDelete) badges.push(<Badge key="delete" variant="destructive">Delete</Badge>);
    return badges;
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-32">Loading permissions...</div>;
  }

  return (
    <div className="space-y-4">

      {permissions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">No permissions found</div>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assigned To</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Document/Screen</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium">
                    {permission.userName || permission.roleName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {permission.userId ? (
                        <>
                          <User className="h-4 w-4" />
                          <span>User</span>
                        </>
                      ) : (
                        <>
                          <Users className="h-4 w-4" />
                          <span>Role</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{permission.documentName}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {permission.documentPath || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {getPermissionBadges(permission)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(permission)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(permission)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(permission)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AddPermissionDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />

      <ViewPermissionDialog
        permission={selectedPermission}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />

      <EditPermissionDialog
        permission={selectedPermission}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  );
}