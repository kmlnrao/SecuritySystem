import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

const createDocumentSchema = z.object({
  name: z.string().min(2, "Document name must be at least 2 characters"),
  path: z.string().min(2, "Path must be at least 2 characters"),
  isActive: z.boolean().default(true),
});

const editDocumentSchema = z.object({
  name: z.string().min(2, "Document name must be at least 2 characters"),
  path: z.string().min(2, "Path must be at least 2 characters"),
  isActive: z.boolean(),
});

type CreateDocumentData = z.infer<typeof createDocumentSchema>;
type EditDocumentData = z.infer<typeof editDocumentSchema>;

interface Document {
  id: string;
  name: string;
  path: string;
  isActive: boolean;
  createdAt: string;
}

interface AddDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDocumentDialog({ open, onOpenChange }: AddDocumentDialogProps) {
  const { toast } = useToast();
  const form = useForm<CreateDocumentData>({
    resolver: zodResolver(createDocumentSchema),
    defaultValues: {
      name: "",
      path: "",
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (documentData: CreateDocumentData) => {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create document');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast({
        title: "Success",
        description: "Document created successfully",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateDocumentData) => {
    createMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Document</DialogTitle>
          <DialogDescription>
            Create a new document for the hospital system.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter document name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="path"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Path</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter document path (e.g., /patients/list)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Enable this document
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Document"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface EditDocumentDialogProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditDocumentDialog({ document, open, onOpenChange }: EditDocumentDialogProps) {
  const { toast } = useToast();
  const form = useForm<EditDocumentData>({
    resolver: zodResolver(editDocumentSchema),
    defaultValues: {
      name: document?.name || "",
      path: document?.path || "",
      isActive: document?.isActive || true,
    },
  });

  useEffect(() => {
    if (document) {
      form.reset({
        name: document.name,
        path: document.path,
        isActive: document.isActive,
      });
    }
  }, [document, form]);

  const updateMutation = useMutation({
    mutationFn: async (documentData: EditDocumentData) => {
      if (!document) throw new Error("No document selected");
      
      const response = await fetch(`/api/documents/${document.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update document');
      }

      return response.json();
    },
    onSuccess: (updatedDocument) => {
      // Update the cache directly with the new data
      queryClient.setQueryData(["documents"], (oldData: any) => {
        if (!oldData) return [updatedDocument];
        return oldData.map((document: any) => 
          document.id === updatedDocument.id ? updatedDocument : document
        );
      });
      // Also invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast({
        title: "Success",
        description: "Document updated successfully",
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EditDocumentData) => {
    updateMutation.mutate(data);
  };

  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Document</DialogTitle>
          <DialogDescription>
            Update document information.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter document name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="path"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Path</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter document path" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Enable this document
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Updating..." : "Update Document"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface ViewDocumentDialogProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewDocumentDialog({ document, open, onOpenChange }: ViewDocumentDialogProps) {
  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Document Details</DialogTitle>
          <DialogDescription>
            View document information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Document Name</label>
            <p className="text-sm font-semibold">{document.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Document Path</label>
            <p className="text-sm font-mono bg-gray-100 p-2 rounded">{document.path}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <div className="mt-1">
              <Badge 
                variant={document.isActive ? "default" : "secondary"}
                className={document.isActive ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
              >
                {document.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Created</label>
            <p className="text-sm">{new Date(document.createdAt).toLocaleDateString()}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Document ID</label>
            <p className="text-sm font-mono text-xs bg-gray-100 p-2 rounded">{document.id}</p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}