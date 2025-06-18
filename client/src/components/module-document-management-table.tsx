import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Eye, Trash2, Search, Plus, History, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { AuditLogViewer } from "./audit-log-viewer";

interface ModuleDocument {
  moduleId: string;
  documentId: string;
  moduleName?: string;
  documentName?: string;
}

export function ModuleDocumentManagementTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModuleDocument, setSelectedModuleDocument] = useState<ModuleDocument | null>(null);
  const [editModuleDocumentOpen, setEditModuleDocumentOpen] = useState(false);
  const [viewModuleDocumentOpen, setViewModuleDocumentOpen] = useState(false);
  const [addModuleDocumentOpen, setAddModuleDocumentOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedDocumentId, setSelectedDocumentId] = useState("");
  const { toast } = useToast();

  const { data: moduleDocuments = [], isLoading } = useQuery({ 
    queryKey: ["module-documents"],
    queryFn: async () => {
      try {
        const response = await fetch('/api/module-documents', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Module-Documents fetch failed: ${response.status}`);
        }
        
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Module-Documents fetch error:', error);
        return [];
      }
    }
  });

  const { data: modules = [] } = useQuery({ 
    queryKey: ["modules"]
  });

  const { data: documents = [] } = useQuery({ 
    queryKey: ["documents"]
  });

  const createMutation = useMutation({
    mutationFn: async ({ moduleId, documentId }: { moduleId: string, documentId: string }) => {
      const response = await fetch('/api/module-documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ moduleId, documentId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create module-document mapping');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["module-documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/audit-logs"] });
      toast({
        title: "Success",
        description: "Module-document mapping created successfully",
      });
      setAddModuleDocumentOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ moduleId, documentId }: { moduleId: string, documentId: string }) => {
      const response = await fetch(`/api/module-documents/${moduleId}/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove module-document mapping');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["module-documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/audit-logs"] });
      toast({
        title: "Success",
        description: "Module-document mapping removed successfully",
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

  // Enhance module-documents with names
  const enhancedModuleDocuments = moduleDocuments.map((md: any) => {
    const module = modules.find((m: any) => m.id === md.moduleId);
    const document = documents.find((d: any) => d.id === md.documentId);
    return {
      ...md,
      moduleName: module?.name || 'Unknown Module',
      documentName: document?.name || 'Unknown Document'
    };
  });

  const filteredModuleDocuments = enhancedModuleDocuments.filter((md: any) => {
    const matchesSearch = md.moduleName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         md.documentName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = (moduleId: string, documentId: string) => {
    if (confirm("Are you sure you want to remove this module-document mapping?")) {
      deleteMutation.mutate({ moduleId, documentId });
    }
  };

  const handleEdit = (moduleDocument: any) => {
    setSelectedModuleDocument(moduleDocument);
    setEditModuleDocumentOpen(true);
  };

  const handleView = (moduleDocument: any) => {
    setSelectedModuleDocument(moduleDocument);
    setViewModuleDocumentOpen(true);
  };

  const handleAddMapping = () => {
    if (!selectedModuleId || !selectedDocumentId) {
      toast({
        title: "Error",
        description: "Please select both module and document",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate({ 
      moduleId: selectedModuleId, 
      documentId: selectedDocumentId 
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading module-document mappings...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="management" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="management" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Module-Document Management
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
                    placeholder="Search module-document mappings..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  className="bg-accent hover:bg-blue-600 text-white"
                  onClick={() => setAddModuleDocumentOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Map Module-Document
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Module Name</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Document Name</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Module ID</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Document ID</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModuleDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        {moduleDocuments.length === 0 ? "No module-document mappings found" : `No mappings match your search. Total mappings: ${moduleDocuments.length}`}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredModuleDocuments.map((md: any, index: number) => (
                      <TableRow key={`${md.moduleId}-${md.documentId}-${index}`} className="hover:bg-slate-50">
                        <TableCell className="font-medium">{md.moduleName}</TableCell>
                        <TableCell className="font-medium">{md.documentName}</TableCell>
                        <TableCell className="text-sm text-slate-500 font-mono">{md.moduleId}</TableCell>
                        <TableCell className="text-sm text-slate-500 font-mono">{md.documentId}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-accent hover:text-blue-600"
                              onClick={() => handleEdit(md)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-slate-400 hover:text-slate-600"
                              onClick={() => handleView(md)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-400 hover:text-red-600"
                              onClick={() => handleDelete(md.moduleId, md.documentId)}
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
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredModuleDocuments.length}</span> of <span className="font-medium">{moduleDocuments.length}</span> results
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Module-Document Management Audit Logs</h3>
              <p className="text-muted-foreground">
                View all audit trails for module-document mapping operations
              </p>
            </div>
            
            <AuditLogViewer 
              title="Module-Document Management Audit Logs" 
              tableName="module_documents"
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Module-Document Mapping Dialog */}
      <Dialog open={addModuleDocumentOpen} onOpenChange={setAddModuleDocumentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Map Module to Document</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Module</label>
              <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a module" />
                </SelectTrigger>
                <SelectContent>
                  {(modules as any[]).map((module: any) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Select Document</label>
              <Select value={selectedDocumentId} onValueChange={setSelectedDocumentId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a document" />
                </SelectTrigger>
                <SelectContent>
                  {(documents as any[]).map((document: any) => (
                    <SelectItem key={document.id} value={document.id}>
                      {document.name} ({document.path})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setAddModuleDocumentOpen(false);
                setSelectedModuleId("");
                setSelectedDocumentId("");
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddMapping}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create Mapping"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Module-Document Dialog */}
      <Dialog open={viewModuleDocumentOpen} onOpenChange={setViewModuleDocumentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Module-Document Mapping Details</DialogTitle>
          </DialogHeader>
          
          {selectedModuleDocument && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Module</label>
                <p className="text-sm mt-1">{selectedModuleDocument.moduleName}</p>
                <p className="text-xs text-slate-500 font-mono">{selectedModuleDocument.moduleId}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">Document</label>
                <p className="text-sm mt-1">{selectedModuleDocument.documentName}</p>
                <p className="text-xs text-slate-500 font-mono">{selectedModuleDocument.documentId}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setViewModuleDocumentOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Module-Document Dialog */}
      <Dialog open={editModuleDocumentOpen} onOpenChange={setEditModuleDocumentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Module-Document Mapping</DialogTitle>
          </DialogHeader>
          
          {selectedModuleDocument && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Current Module</label>
                <p className="text-sm mt-1 p-2 bg-slate-50 rounded">
                  {selectedModuleDocument.moduleName}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Current Document</label>
                <p className="text-sm mt-1 p-2 bg-slate-50 rounded">
                  {selectedModuleDocument.documentName}
                </p>
              </div>

              <div className="text-sm text-slate-600 bg-blue-50 p-3 rounded">
                <strong>Note:</strong> To modify this mapping, please delete the current mapping and create a new one with the desired module-document combination.
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditModuleDocumentOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedModuleDocument) {
                  handleDelete(selectedModuleDocument.moduleId, selectedModuleDocument.documentId);
                  setEditModuleDocumentOpen(false);
                }
              }}
            >
              Delete Mapping
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}