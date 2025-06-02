import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Plus, Trash2, Search } from "lucide-react";

interface Module {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
}

interface Document {
  id: string;
  name: string;
  path: string;
  displayOrder: number;
}

interface ModuleDocument {
  moduleId: string;
  documentId: string;
  moduleName: string;
  documentName: string;
  documentPath: string;
}

export function ModuleDocumentTable() {
  const { toast } = useToast();
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [selectedDocument, setSelectedDocument] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch modules
  const { data: modules = [] } = useQuery<Module[]>({
    queryKey: ["/api/modules"],
    queryFn: async () => {
      const response = await fetch('/api/modules', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        }
      });
      if (!response.ok) throw new Error('Failed to fetch modules');
      return await response.json();
    }
  });

  // Fetch documents
  const { data: documents = [] } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
    queryFn: async () => {
      const response = await fetch('/api/documents', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        }
      });
      if (!response.ok) throw new Error('Failed to fetch documents');
      return await response.json();
    }
  });

  // Fetch module-document mappings
  const { data: mappings = [] } = useQuery<ModuleDocument[]>({
    queryKey: ["/api/module-documents"],
    queryFn: async () => {
      const response = await fetch('/api/module-documents', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        }
      });
      if (!response.ok) throw new Error('Failed to fetch module-document mappings');
      return await response.json();
    }
  });

  // Add mapping mutation
  const addMappingMutation = useMutation({
    mutationFn: async ({ moduleId, documentId }: { moduleId: string; documentId: string }) => {
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
        throw new Error(error.message || 'Failed to add mapping');
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/module-documents"] });
      queryClient.invalidateQueries({ queryKey: ["navigation"] });
      toast({
        title: "Success",
        description: "Document added to module successfully",
      });
      setSelectedModule("");
      setSelectedDocument("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Remove mapping mutation
  const removeMappingMutation = useMutation({
    mutationFn: async ({ moduleId, documentId }: { moduleId: string; documentId: string }) => {
      const response = await fetch(`/api/module-documents/${moduleId}/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove mapping');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/module-documents"] });
      queryClient.invalidateQueries({ queryKey: ["navigation"] });
      toast({
        title: "Success",
        description: "Document removed from module successfully",
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

  const handleAddMapping = () => {
    if (!selectedModule || !selectedDocument) {
      toast({
        title: "Error",
        description: "Please select both a module and a document",
        variant: "destructive",
      });
      return;
    }

    // Check if mapping already exists
    const existingMapping = mappings.find(
      m => m.moduleId === selectedModule && m.documentId === selectedDocument
    );
    
    if (existingMapping) {
      toast({
        title: "Error",
        description: "This document is already assigned to the selected module",
        variant: "destructive",
      });
      return;
    }

    addMappingMutation.mutate({ moduleId: selectedModule, documentId: selectedDocument });
  };

  const handleRemoveMapping = (moduleId: string, documentId: string) => {
    removeMappingMutation.mutate({ moduleId, documentId });
  };

  // Filter mappings based on search term
  const filteredMappings = mappings.filter(mapping => 
    mapping.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.documentPath.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Add New Mapping */}
      <Card>
        <CardHeader>
          <CardTitle>Add Document to Module</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Module</Label>
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger>
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.name} (Order: {module.displayOrder})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Document</Label>
              <Select value={selectedDocument} onValueChange={setSelectedDocument}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document" />
                </SelectTrigger>
                <SelectContent>
                  {documents.map((document) => (
                    <SelectItem key={document.id} value={document.id}>
                      {document.name} (Order: {document.displayOrder})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={handleAddMapping} 
                disabled={addMappingMutation.isPending || !selectedModule || !selectedDocument}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Mapping
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Module-Document Mappings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search mappings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Module</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Document Path</TableHead>
                  <TableHead>Display Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMappings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No module-document mappings found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMappings.map((mapping) => {
                    const module = modules.find(m => m.id === mapping.moduleId);
                    const document = documents.find(d => d.id === mapping.documentId);
                    
                    return (
                      <TableRow key={`${mapping.moduleId}-${mapping.documentId}`}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{mapping.moduleName}</span>
                            <Badge variant="outline">Order: {module?.displayOrder || 0}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{mapping.documentName}</span>
                            <Badge variant="outline">Order: {document?.displayOrder || 0}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {mapping.documentPath}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div>Module: {module?.displayOrder || 0}</div>
                            <div>Document: {document?.displayOrder || 0}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveMapping(mapping.moduleId, mapping.documentId)}
                            disabled={removeMappingMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}