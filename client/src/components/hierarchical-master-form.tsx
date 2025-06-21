import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

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

interface HierarchicalMasterFormProps {
  columns: ColumnDefinition[];
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export function HierarchicalMasterForm({ columns, initialData, onSubmit, isLoading }: HierarchicalMasterFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const data: Record<string, any> = {};
    columns.forEach(column => {
      data[column.name] = initialData?.[column.name] || column.defaultValue || "";
    });
    return data;
  });

  const [referenceData, setReferenceData] = useState<Record<string, MasterDataRecord[]>>({});

  // Fetch all master tables for reference fields
  const { data: allTables = [] } = useQuery<MasterTableConfig[]>({
    queryKey: ["/api/master-tables"],
  });

  // Fetch reference data for each reference column
  useEffect(() => {
    const referenceColumns = columns.filter(col => col.type === 'reference' && col.referenceTable);
    
    referenceColumns.forEach(async (column) => {
      if (column.referenceTable) {
        try {
          const response = await fetch(`/api/master-tables/${column.referenceTable}/records`);
          if (response.ok) {
            const records = await response.json();
            setReferenceData(prev => ({
              ...prev,
              [column.name]: records
            }));
          }
        } catch (error) {
          console.error(`Failed to fetch reference data for ${column.name}:`, error);
        }
      }
    });
  }, [columns]);

  const updateFormData = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Reset dependent fields when parent reference changes
    const dependentColumns = columns.filter(col => 
      col.type === 'reference' && 
      col.referenceTable && 
      isDependentOn(col, fieldName)
    );

    if (dependentColumns.length > 0) {
      const resetData: Record<string, any> = {};
      dependentColumns.forEach(col => {
        resetData[col.name] = "";
      });
      setFormData(prev => ({
        ...prev,
        ...resetData
      }));
    }
  };

  const isDependentOn = (column: ColumnDefinition, parentField: string): boolean => {
    // Check if this column depends on the changed parent field
    // This would be based on the reference table configuration
    const parentColumn = columns.find(col => col.name === parentField);
    if (!parentColumn || parentColumn.type !== 'reference') return false;

    // For example, if State depends on Country, City depends on State
    const dependencyMap: Record<string, string[]> = {
      'Country': ['State', 'Province'],
      'State': ['City', 'District'],
      'Province': ['City', 'District']
    };

    const parentTableName = allTables.find(t => t.id === parentColumn.referenceTable)?.tableName || '';
    const currentTableName = allTables.find(t => t.id === column.referenceTable)?.tableName || '';

    return dependencyMap[parentTableName]?.includes(currentTableName) || false;
  };

  const getFilteredReferenceData = (column: ColumnDefinition): MasterDataRecord[] => {
    const records = referenceData[column.name] || [];
    
    // Check if this column depends on another reference field
    const parentColumn = columns.find(col => 
      col.type === 'reference' && 
      isDependentOn(column, col.name)
    );

    if (parentColumn && formData[parentColumn.name]) {
      // Filter records based on parent selection
      return records.filter(record => {
        try {
          const data = JSON.parse(record.recordData);
          return data[`${parentColumn.name}Id`] === formData[parentColumn.name] ||
                 data[parentColumn.name] === formData[parentColumn.name];
        } catch {
          return true;
        }
      });
    }

    return records;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const missingFields = columns
      .filter(col => col.required && !formData[col.name])
      .map(col => col.name);

    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.join(', ')}`);
      return;
    }

    onSubmit(formData);
  };

  const renderField = (column: ColumnDefinition) => {
    const value = formData[column.name] || "";

    switch (column.type) {
      case 'reference':
        const filteredRecords = getFilteredReferenceData(column);
        const referencedTable = allTables.find(t => t.id === column.referenceTable);
        
        return (
          <Select
            value={value}
            onValueChange={(newValue) => updateFormData(column.name, newValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${column.name}`} />
            </SelectTrigger>
            <SelectContent>
              {filteredRecords.map((record) => {
                try {
                  const data = JSON.parse(record.recordData);
                  const displayValue = column.referenceDisplayField 
                    ? data[column.referenceDisplayField] 
                    : Object.values(data)[0];
                  
                  return (
                    <SelectItem key={record.id} value={record.id}>
                      {displayValue}
                    </SelectItem>
                  );
                } catch {
                  return (
                    <SelectItem key={record.id} value={record.id}>
                      Record {record.id}
                    </SelectItem>
                  );
                }
              })}
            </SelectContent>
          </Select>
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={column.name}
              checked={value === true || value === "true"}
              onCheckedChange={(checked) => updateFormData(column.name, checked)}
            />
            <Label htmlFor={column.name}>Yes</Label>
          </div>
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => updateFormData(column.name, e.target.value)}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => updateFormData(column.name, e.target.value)}
            placeholder={`Enter ${column.name}`}
          />
        );

      case 'email':
        return (
          <Input
            type="email"
            value={value}
            onChange={(e) => updateFormData(column.name, e.target.value)}
            placeholder={`Enter ${column.name}`}
          />
        );

      case 'text':
      default:
        if (column.maxLength && column.maxLength > 100) {
          return (
            <Textarea
              value={value}
              onChange={(e) => updateFormData(column.name, e.target.value)}
              placeholder={`Enter ${column.name}`}
              maxLength={column.maxLength}
            />
          );
        }
        return (
          <Input
            value={value}
            onChange={(e) => updateFormData(column.name, e.target.value)}
            placeholder={`Enter ${column.name}`}
            maxLength={column.maxLength}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {columns.map((column) => (
        <div key={column.name} className="space-y-2">
          <Label htmlFor={column.name}>
            {column.name.charAt(0).toUpperCase() + column.name.slice(1)}
            {column.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {renderField(column)}
          {column.type === 'reference' && (
            <p className="text-xs text-muted-foreground">
              {isDependentOn(column, columns.find(c => c.type === 'reference')?.name || '') 
                ? "Selection will be filtered based on your previous choice"
                : "Select from available options"
              }
            </p>
          )}
        </div>
      ))}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Record"}
        </Button>
      </div>
    </form>
  );
}