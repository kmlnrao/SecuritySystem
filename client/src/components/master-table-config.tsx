import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Settings, Database, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface ColumnDefinition {
  name: string;
  type: string;
  required: boolean;
  displayInFrontend: boolean;
  maxLength?: number;
  defaultValue?: string;
  referenceTable?: string;
  referenceDisplayField?: string;
}

interface MasterTableConfig {
  id: string;
  tableName: string;
  displayName: string;
  description?: string;
  columns: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const COLUMN_TYPES = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "date", label: "Date" },
  { value: "boolean", label: "Yes/No" },
  { value: "select", label: "Dropdown" },
  { value: "reference", label: "Reference (Link to another table)" }
];

export function MasterTableConfigurationPage() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<MasterTableConfig | null>(null);

  const { data: configs = [], isLoading } = useQuery<MasterTableConfig[]>({
    queryKey: ["/api/master-tables"],
  });

  const createMutation = useMutation({
    mutationFn: async (configData: any) => {
      const response = await fetch('/api/master-tables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configData),
      });
      if (!response.ok) throw new Error('Failed to create master table');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/master-tables"] });
      toast({ title: "Success", description: "Master table configuration created successfully" });
      setIsCreateDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, configData }: { id: string; configData: any }) => {
      const response = await fetch(`/api/master-tables/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configData),
      });
      if (!response.ok) throw new Error('Failed to update master table');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/master-tables"] });
      toast({ title: "Success", description: "Master table configuration updated successfully" });
      setEditingConfig(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/master-tables/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete master table');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/master-tables"] });
      toast({ title: "Success", description: "Master table configuration deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading master table configurations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Master Table Configuration</h2>
          <p className="text-muted-foreground">
            Configure dynamic master tables for your hospital management system
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Master Table
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Master Table Configuration</DialogTitle>
            </DialogHeader>
            <CreateMasterTableForm
              onSubmit={(data) => createMutation.mutate(data)}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={!!editingConfig} onOpenChange={(open) => !open && setEditingConfig(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Master Table Configuration</DialogTitle>
            </DialogHeader>
            {editingConfig && (
              <EditMasterTableForm
                config={editingConfig}
                configs={configs}
                onSubmit={(data) => updateMutation.mutate({ id: editingConfig.id, configData: data })}
                isLoading={updateMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {configs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Database className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Master Tables Configured</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first master table configuration to start managing dynamic data structures.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Master Table
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {configs.map((config: MasterTableConfig) => (
              <MasterTableConfigCard
                key={config.id}
                config={config}
                onEdit={() => setEditingConfig(config)}
                onDelete={() => deleteMutation.mutate(config.id)}
                isDeleting={deleteMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CreateMasterTableForm({
  onSubmit,
  isLoading
}: {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const [tableName, setTableName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [columns, setColumns] = useState<ColumnDefinition[]>([
    { name: "name", type: "text", required: true, displayInFrontend: true, maxLength: 100 }
  ]);

  const addColumn = () => {
    setColumns([...columns, { name: "", type: "text", required: false, displayInFrontend: true }]);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const updateColumn = (index: number, field: keyof ColumnDefinition, value: any) => {
    const updatedColumns = [...columns];
    updatedColumns[index] = { ...updatedColumns[index], [field]: value };
    setColumns(updatedColumns);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tableName || !displayName || columns.length === 0) {
      return;
    }

    const validColumns = columns.filter(col => col.name.trim() !== "");
    
    onSubmit({
      tableName: tableName.toLowerCase().replace(/\s+/g, '_'),
      displayName,
      description,
      columns: JSON.stringify(validColumns)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tableName">Table Name</Label>
          <Input
            id="tableName"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="e.g., department"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Used for database table name (lowercase, underscores)
          </p>
        </div>
        <div>
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g., Department Master"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of this master table"
          rows={2}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Label>Column Configuration</Label>
          <Button type="button" variant="outline" size="sm" onClick={addColumn}>
            <Plus className="mr-2 h-3 w-3" />
            Add Column
          </Button>
        </div>
        
        {/* Column Headers */}
        <div className="grid grid-cols-12 gap-3 px-3 py-2 bg-muted rounded-lg text-sm font-medium mb-3">
          <div className="col-span-4">Column Name</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Required</div>
          <div className="col-span-2">Frontend Display</div>
          <div className="col-span-2">Actions</div>
        </div>
        
        <div className="space-y-3">
          {columns.map((column, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 items-center p-3 border rounded-lg">
              <div className="col-span-4">
                <Input
                  placeholder="Column name"
                  value={column.name}
                  onChange={(e) => updateColumn(index, 'name', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Select
                  value={column.type}
                  onValueChange={(value) => updateColumn(index, 'type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLUMN_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Select
                  value={column.required ? "yes" : "no"}
                  onValueChange={(value) => updateColumn(index, 'required', value === "yes")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Required</SelectItem>
                    <SelectItem value="no">Optional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Select
                  value={column.displayInFrontend ? "yes" : "no"}
                  onValueChange={(value) => updateColumn(index, 'displayInFrontend', value === "yes")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">
                      <div className="flex items-center gap-2">
                        <Eye className="h-3 w-3" />
                        Show
                      </div>
                    </SelectItem>
                    <SelectItem value="no">
                      <div className="flex items-center gap-2">
                        <EyeOff className="h-3 w-3" />
                        Hide
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                {columns.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeColumn(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Frontend Display:</strong> Columns set to "Hide" will not be visible in the frontend interface but can be updated through API calls or backend operations. 
            This is useful for system fields, tracking data, or technical columns that shouldn't be exposed to end users.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Master Table"}
        </Button>
      </div>
    </form>
  );
}

function EditMasterTableForm({
  config,
  configs,
  onSubmit,
  isLoading
}: {
  config: MasterTableConfig;
  configs: MasterTableConfig[];
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const existingColumns = JSON.parse(config.columns) as ColumnDefinition[];
  // Migrate existing columns to include displayInFrontend if missing
  const migratedColumns = existingColumns.map(col => ({
    ...col,
    displayInFrontend: col.displayInFrontend !== undefined ? col.displayInFrontend : true
  }));
  const [tableName, setTableName] = useState(config.tableName);
  const [displayName, setDisplayName] = useState(config.displayName);
  const [description, setDescription] = useState(config.description || "");
  const [columns, setColumns] = useState<ColumnDefinition[]>(migratedColumns);

  const addColumn = () => {
    setColumns([...columns, { name: "", type: "text", required: false, displayInFrontend: true }]);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const updateColumn = (index: number, field: keyof ColumnDefinition, value: any) => {
    const updatedColumns = [...columns];
    updatedColumns[index] = { ...updatedColumns[index], [field]: value };
    setColumns(updatedColumns);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tableName || !displayName || columns.length === 0) {
      return;
    }

    const validColumns = columns.filter(col => col.name.trim() !== "");
    
    onSubmit({
      tableName: tableName.toLowerCase().replace(/\s+/g, '_'),
      displayName,
      description,
      columns: JSON.stringify(validColumns)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tableName">Table Name</Label>
          <Input
            id="tableName"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="e.g., department"
            required
            disabled
          />
          <p className="text-xs text-muted-foreground mt-1">
            Table name cannot be changed after creation
          </p>
        </div>
        <div>
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g., Department Master"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of this master table"
          rows={2}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Label>Column Configuration</Label>
          <Button type="button" variant="outline" size="sm" onClick={addColumn}>
            <Plus className="mr-2 h-3 w-3" />
            Add Column
          </Button>
        </div>
        
        {/* Column Headers */}
        <div className="grid grid-cols-12 gap-3 px-3 py-2 bg-muted rounded-lg text-sm font-medium mb-3">
          <div className="col-span-4">Column Name</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Required</div>
          <div className="col-span-2">Frontend Display</div>
          <div className="col-span-2">Actions</div>
        </div>
        
        <div className="space-y-3">
          {columns.map((column, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 items-center p-3 border rounded-lg">
              <div className="col-span-4">
                <Input
                  placeholder="Column name"
                  value={column.name}
                  onChange={(e) => updateColumn(index, 'name', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Select
                  value={column.type}
                  onValueChange={(value) => updateColumn(index, 'type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLUMN_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Select
                  value={column.required ? "yes" : "no"}
                  onValueChange={(value) => updateColumn(index, 'required', value === "yes")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Required</SelectItem>
                    <SelectItem value="no">Optional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Select
                  value={column.displayInFrontend ? "yes" : "no"}
                  onValueChange={(value) => updateColumn(index, 'displayInFrontend', value === "yes")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">
                      <div className="flex items-center gap-2">
                        <Eye className="h-3 w-3" />
                        Show
                      </div>
                    </SelectItem>
                    <SelectItem value="no">
                      <div className="flex items-center gap-2">
                        <EyeOff className="h-3 w-3" />
                        Hide
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                {columns.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeColumn(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              {/* Reference table configuration for EditMasterTableForm */}
              {column.type === 'reference' && (
                <div className="col-span-12 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-800 mb-3">Reference Configuration</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-blue-700">Reference Table</Label>
                      <p className="text-xs text-blue-600 mb-2">Select which master table this field should reference</p>
                      <Select
                        value={column.referenceTable || ""}
                        onValueChange={(value) => updateColumn(index, 'referenceTable', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a table to reference" />
                        </SelectTrigger>
                        <SelectContent>
                          {configs.filter(c => c.id !== config.id).map(table => (
                            <SelectItem key={table.id} value={table.id}>
                              {table.displayName} ({table.tableName})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-blue-700">Display Field</Label>
                      <p className="text-xs text-blue-600 mb-2">Which field from the referenced table to show in dropdown</p>
                      <Input
                        placeholder="e.g., Country Name, State Name"
                        value={column.referenceDisplayField || ""}
                        onChange={(e) => updateColumn(index, 'referenceDisplayField', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Frontend Display:</strong> Columns set to "Hide" will not be visible in the frontend interface but can be updated through API calls or backend operations.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Master Table"}
        </Button>
      </div>
    </form>
  );
}

function MasterTableConfigCard({
  config,
  onEdit,
  onDelete,
  isDeleting
}: {
  config: MasterTableConfig;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const columns = JSON.parse(config.columns) as ColumnDefinition[];
  const frontendColumns = columns.filter(col => col.displayInFrontend !== false);
  const hiddenColumns = columns.filter(col => col.displayInFrontend === false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              {config.displayName}
              <Badge variant={config.isActive ? "default" : "secondary"}>
                {config.isActive ? "Active" : "Inactive"}
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Table: {config.tableName} • {columns.length} columns
            </p>
            {config.description && (
              <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Frontend Visible Columns ({frontendColumns.length})
            </h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Column</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Required</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {frontendColumns.map((column) => (
                  <TableRow key={column.name}>
                    <TableCell className="font-medium">{column.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{column.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={column.required ? "destructive" : "secondary"}>
                        {column.required ? "Required" : "Optional"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {hiddenColumns.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <EyeOff className="h-4 w-4" />
                Hidden Columns ({hiddenColumns.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {hiddenColumns.map((column) => (
                  <Badge key={column.name} variant="outline" className="text-muted-foreground">
                    {column.name} ({column.type})
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                These columns are not displayed in the frontend but can be managed through API calls
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}