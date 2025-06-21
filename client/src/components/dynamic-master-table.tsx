import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Search, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { HierarchicalMasterForm } from "./hierarchical-master-form";

interface ColumnDefinition {
  name: string;
  type: string;
  required: boolean;
  displayInFrontend: boolean;
  maxLength?: number;
  defaultValue?: string;
  referenceTable?: string;
  referenceDisplayField?: string;
  referenceValueField?: string;
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

interface MasterDataRecord {
  id: string;
  tableId: string;
  recordData: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DynamicMasterTableProps {
  tableConfig: MasterTableConfig;
}

export function DynamicMasterTable({ tableConfig }: DynamicMasterTableProps) {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MasterDataRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const allColumns = JSON.parse(tableConfig.columns) as ColumnDefinition[];
  // Migrate existing columns to include displayInFrontend if missing
  const migratedColumns = allColumns.map(col => ({
    ...col,
    displayInFrontend: col.displayInFrontend !== undefined ? col.displayInFrontend : true
  }));
  // Only show columns marked for frontend display
  const columns = migratedColumns.filter(col => col.displayInFrontend !== false);

  const { data: records = [], isLoading } = useQuery<MasterDataRecord[]>({
    queryKey: [`/api/master-tables/${tableConfig.id}/records`],
  });

  const createMutation = useMutation({
    mutationFn: async (recordData: any) => {
      const response = await fetch(`/api/master-tables/${tableConfig.id}/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recordData),
      });
      if (!response.ok) throw new Error('Failed to create record');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/master-tables/${tableConfig.id}/records`] });
      toast({ title: "Success", description: "Record created successfully" });
      setIsCreateDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/master-data-records/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update record');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/master-tables/${tableConfig.id}/records`] });
      toast({ title: "Success", description: "Record updated successfully" });
      setEditingRecord(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/master-data-records/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete record');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/master-tables/${tableConfig.id}/records`] });
      toast({ title: "Success", description: "Record deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const filteredRecords = records.filter((record) => {
    if (!searchTerm) return true;
    
    try {
      const data = JSON.parse(record.recordData);
      return Object.values(data).some((value: any) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch {
      return false;
    }
  });

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading {tableConfig.displayName}...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{tableConfig.displayName}</h2>
          <p className="text-muted-foreground">
            {tableConfig.description || `Manage ${tableConfig.displayName} records`}
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New {tableConfig.displayName} Record</DialogTitle>
            </DialogHeader>
            <HierarchicalMasterForm
              columns={columns}
              onSubmit={(data) => createMutation.mutate(data)}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="outline">
          {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {filteredRecords.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Records Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm ? "No records match your search criteria." : `No ${tableConfig.displayName} records exist yet.`}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Record
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.name}>
                    {column.name.charAt(0).toUpperCase() + column.name.slice(1)}
                    {column.required && <span className="text-red-500 ml-1">*</span>}
                  </TableHead>
                ))}
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record: MasterDataRecord) => {
                const data = JSON.parse(record.recordData);
                return (
                  <TableRow key={record.id}>
                    {columns.map((column) => (
                      <TableCell key={column.name}>
                        {renderCellValue(data[column.name], column.type)}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Badge variant={record.isActive ? "default" : "secondary"}>
                        {record.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(record.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingRecord(record)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMutation.mutate(record.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {editingRecord && (
        <Dialog open={!!editingRecord} onOpenChange={() => setEditingRecord(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit {tableConfig.displayName} Record</DialogTitle>
            </DialogHeader>
            <HierarchicalMasterForm
              columns={columns}
              initialData={JSON.parse(editingRecord.recordData)}
              onSubmit={(data) => updateMutation.mutate({ id: editingRecord.id, data })}
              isLoading={updateMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function DynamicRecordForm({
  columns,
  initialData,
  onSubmit,
  isLoading
}: {
  columns: ColumnDefinition[];
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<any>(
    initialData || columns.reduce((acc, column) => {
      acc[column.name] = column.defaultValue || (column.type === "boolean" ? false : "");
      return acc;
    }, {} as any)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const missingFields = columns
      .filter(col => col.required)
      .filter(col => !formData[col.name] || (typeof formData[col.name] === 'string' && formData[col.name].trim() === ''));
    
    if (missingFields.length > 0) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        {columns.map((column) => (
          <div key={column.name}>
            <Label htmlFor={column.name}>
              {column.name.charAt(0).toUpperCase() + column.name.slice(1)}
              {column.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {renderFormField(column, formData[column.name], (value) => {
              setFormData({ ...formData, [column.name]: value });
            })}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : (initialData ? "Update Record" : "Create Record")}
        </Button>
      </div>
    </form>
  );
}

function renderFormField(column: ColumnDefinition, value: any, onChange: (value: any) => void) {
  switch (column.type) {
    case "text":
      return (
        <Input
          id={column.name}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          maxLength={column.maxLength}
          required={column.required}
        />
      );
    case "number":
      return (
        <Input
          id={column.name}
          type="number"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          required={column.required}
        />
      );
    case "email":
      return (
        <Input
          id={column.name}
          type="email"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          required={column.required}
        />
      );
    case "date":
      return (
        <Input
          id={column.name}
          type="date"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          required={column.required}
        />
      );
    case "boolean":
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={column.name}
            checked={value || false}
            onCheckedChange={onChange}
          />
          <Label htmlFor={column.name}>Yes</Label>
        </div>
      );
    default:
      return (
        <Input
          id={column.name}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          required={column.required}
        />
      );
  }
}

function renderCellValue(value: any, type: string) {
  if (value == null || value === "") {
    return <span className="text-muted-foreground">-</span>;
  }

  switch (type) {
    case "boolean":
      return (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Yes" : "No"}
        </Badge>
      );
    case "date":
      try {
        return format(new Date(value), "MMM dd, yyyy");
      } catch {
        return value;
      }
    case "email":
      return (
        <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
          {value}
        </a>
      );
    default:
      return String(value);
  }
}