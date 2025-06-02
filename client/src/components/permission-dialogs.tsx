import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const createPermissionSchema = z.object({
  userId: z.string().optional(),
  roleId: z.string().optional(),
  documentId: z.string().min(1, "Document is required"),
  canAdd: z.boolean().default(false),
  canModify: z.boolean().default(false),
  canDelete: z.boolean().default(false),
  canQuery: z.boolean().default(false),
}).refine((data) => data.userId || data.roleId, {
  message: "Either user or role must be selected",
  path: ["userId"],
});

type CreatePermissionData = z.infer<typeof createPermissionSchema>;

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

interface User {
  id: string;
  username: string;
  email: string;
}

interface Role {
  id: string;
  name: string;
}

interface Document {
  id: string;
  name: string;
  path: string;
}

interface AddPermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPermissionDialog({ open, onOpenChange }: AddPermissionDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [assignmentType, setAssignmentType] = useState<"user" | "role">("user");

  const form = useForm<CreatePermissionData>({
    resolver: zodResolver(createPermissionSchema),
    defaultValues: {
      canAdd: false,
      canModify: false,
      canDelete: false,
      canQuery: false,
    },
  });

  // Fetch users, roles, and documents
  const { data: users = [] } = useQuery<User[]>({ queryKey: ["/api/users"] });
  const { data: roles = [] } = useQuery<Role[]>({ queryKey: ["/api/roles"] });
  const { data: documents = [] } = useQuery<Document[]>({ queryKey: ["/api/documents"] });

  const createMutation = useMutation({
    mutationFn: async (permissionData: CreatePermissionData) => {
      const response = await apiRequest("POST", "/api/permissions", permissionData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/permissions"] });
      toast({ title: "Permission created successfully" });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create permission",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreatePermissionData) => {
    if (assignmentType === "role") {
      data.userId = undefined;
    } else {
      data.roleId = undefined;
    }
    createMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Permission</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={assignmentType === "user" ? "default" : "outline"}
                onClick={() => setAssignmentType("user")}
                className="flex-1"
              >
                Assign to User
              </Button>
              <Button
                type="button"
                variant={assignmentType === "role" ? "default" : "outline"}
                onClick={() => setAssignmentType("role")}
                className="flex-1"
              >
                Assign to Role
              </Button>
            </div>

            {assignmentType === "user" ? (
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id || ""}>
                            {user.username} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id || ""}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="documentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document/Screen</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a document" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {documents.map((document) => (
                        <SelectItem key={document.id} value={document.id || ""}>
                          {document.name} ({document.path})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Permissions</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="canQuery"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Can View/Query</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="canAdd"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Can Add</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="canModify"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Can Modify</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="canDelete"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Can Delete</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Permission"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const editPermissionSchema = z.object({
  userId: z.string().optional(),
  roleId: z.string().optional(),
  documentId: z.string().min(1, "Document is required"),
  canAdd: z.boolean().optional(),
  canModify: z.boolean().optional(),
  canDelete: z.boolean().optional(),
  canQuery: z.boolean().optional(),
});

type EditPermissionData = z.infer<typeof editPermissionSchema>;

interface EditPermissionDialogProps {
  permission: Permission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPermissionDialog({ permission, open, onOpenChange }: EditPermissionDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: roles = [] } = useQuery<Role[]>({
    queryKey: ["/api/roles"],
  });

  const { data: documents = [] } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const form = useForm<EditPermissionData>({
    resolver: zodResolver(editPermissionSchema),
    defaultValues: {
      userId: "",
      roleId: "",
      documentId: "",
      canAdd: false,
      canModify: false,
      canDelete: false,
      canQuery: false,
    },
  });

  // Reset form when permission changes
  React.useEffect(() => {
    if (permission) {
      form.reset({
        userId: permission.userId || "",
        roleId: permission.roleId || "",
        documentId: permission.documentId,
        canAdd: permission.canAdd,
        canModify: permission.canModify,
        canDelete: permission.canDelete,
        canQuery: permission.canQuery,
      });
    }
  }, [permission, form]);

  const updateMutation = useMutation({
    mutationFn: async (permissionData: EditPermissionData) => {
      if (!permission) throw new Error("No permission selected");
      const response = await apiRequest("PUT", `/api/permissions/${permission.id}`, permissionData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/permissions"] });
      toast({ title: "Permission updated successfully" });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update permission",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EditPermissionData) => {
    updateMutation.mutate(data);
  };

  if (!permission) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Permission</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <div>
                <strong>Current Document:</strong> {permission.documentName}
              </div>
              <div>
                <strong>Current Path:</strong> {permission.documentPath || 'N/A'}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign to User</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a user" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.username}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign to Role</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id || ""}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="documentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document/Screen</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a document" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {documents.map((document) => (
                          <SelectItem key={document.id} value={document.id || ""}>
                            {document.name} ({document.path})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="canQuery"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Can View/Query</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="canAdd"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Can Add</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="canModify"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Can Modify</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="canDelete"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Can Delete</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Updating..." : "Update Permission"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface ViewPermissionDialogProps {
  permission: Permission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewPermissionDialog({ permission, open, onOpenChange }: ViewPermissionDialogProps) {
  if (!permission) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Permission Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <strong>Assigned to:</strong>{" "}
            {permission.userName ? `User: ${permission.userName}` : `Role: ${permission.roleName}`}
          </div>
          <div>
            <strong>Document:</strong> {permission.documentName}
          </div>
          <div>
            <strong>Path:</strong> {permission.documentPath || 'N/A'}
          </div>
          <div>
            <strong>Permissions:</strong>
            <ul className="list-disc list-inside mt-1">
              {permission.canQuery && <li>Can View/Query</li>}
              {permission.canAdd && <li>Can Add</li>}
              {permission.canModify && <li>Can Modify</li>}
              {permission.canDelete && <li>Can Delete</li>}
            </ul>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}