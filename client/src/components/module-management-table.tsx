import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Eye, Trash2, Search, Plus, History, Puzzle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { AuditLogViewer } from "./audit-log-viewer";

interface Module {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

export function ModuleManagementTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [editModuleOpen, setEditModuleOpen] = useState(false);
  const [viewModuleOpen, setViewModuleOpen] = useState(false);
  const { toast } = useToast();

  const { data: modules = [], isLoading } = useQuery<Module[]>({ 
    queryKey: ["modules"]
  });

  const deleteMutation = useMutation({
    mutationFn: async (moduleId: string) => {
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete module');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      toast({
        title: "Success",
        description: "Module deleted successfully",
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

  const filteredModules = modules.filter((module: any) => {
    const matchesSearch = module.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = (moduleId: string) => {
    if (confirm("Are you sure you want to delete this module?")) {
      deleteMutation.mutate(moduleId);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading modules...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="management" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="management" className="flex items-center gap-2">
            <Puzzle className="h-4 w-4" />
            Module Management
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
                    placeholder="Search modules..."
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
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Module Name</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Description</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Order</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Created</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModules.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        {modules.length === 0 ? "No modules found" : `No modules match your search. Total modules: ${modules.length}`}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredModules.map((module: any) => (
                      <TableRow key={module.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium">{module.name}</TableCell>
                        <TableCell>{module.description || 'No description'}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={module.isActive ? "default" : "secondary"}
                            className={module.isActive ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                          >
                            <div className={`w-2 h-2 rounded-full mr-1 ${module.isActive ? "bg-green-500" : "bg-yellow-500"}`} />
                            {module.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">{module.displayOrder}</TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {new Date(module.createdAt).toLocaleDateString()}
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
                              onClick={() => handleDelete(module.id)}
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
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredModules.length}</span> of <span className="font-medium">{modules.length}</span> results
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Module Management Audit Logs</h3>
              <p className="text-muted-foreground">
                View all audit trails for module management operations
              </p>
            </div>
            
            <AuditLogViewer 
              title="Module Management Audit Logs" 
              tableName="modules"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}