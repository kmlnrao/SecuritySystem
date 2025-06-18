import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Eye, Trash2, Search, Plus, History, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { AuditLogViewer } from "./audit-log-viewer";

interface Document {
  id: string;
  name: string;
  path: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

export function DocumentManagementTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [editDocumentOpen, setEditDocumentOpen] = useState(false);
  const [viewDocumentOpen, setViewDocumentOpen] = useState(false);
  const { toast } = useToast();

  const { data: documents = [], isLoading } = useQuery<Document[]>({ 
    queryKey: ["documents"]
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete document');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast({
        title: "Success",
        description: "Document deleted successfully",
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

  const filteredDocuments = documents.filter((document: any) => {
    const matchesSearch = document.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         document.path?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = (documentId: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      deleteMutation.mutate(documentId);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading documents...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="management" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="management" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Document Management
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
                    placeholder="Search documents..."
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
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Document Name</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Path</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Order</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Created</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        {documents.length === 0 ? "No documents found" : `No documents match your search. Total documents: ${documents.length}`}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map((document: any) => (
                      <TableRow key={document.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium">{document.name}</TableCell>
                        <TableCell className="text-sm text-slate-500">{document.path}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={document.isActive ? "default" : "secondary"}
                            className={document.isActive ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                          >
                            <div className={`w-2 h-2 rounded-full mr-1 ${document.isActive ? "bg-green-500" : "bg-yellow-500"}`} />
                            {document.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">{document.displayOrder}</TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {new Date(document.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-accent hover:text-blue-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-slate-400 hover:text-slate-600"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-400 hover:text-red-600"
                              onClick={() => handleDelete(document.id)}
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
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredDocuments.length}</span> of <span className="font-medium">{documents.length}</span> results
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Document Management Audit Logs</h3>
              <p className="text-muted-foreground">
                View all audit trails for document management operations
              </p>
            </div>
            
            <AuditLogViewer 
              title="Document Management Audit Logs" 
              tableName="documents"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}