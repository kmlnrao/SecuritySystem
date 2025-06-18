import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { History, Eye, User, Globe, Calendar, Database } from "lucide-react";
import { format } from "date-fns";

interface MasterTableAuditLog {
  id: string;
  tableName: string;
  recordId: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  operationType: 'MASTER_DATA_RECORD';
  oldValues?: string;
  newValues?: string;
  userId: string;
  username: string;
  ipAddress: string;
  userAgent?: string;
  timestamp: string;
  tableDisplayName?: string;
  masterTableName?: string;
}

interface MasterTableAuditViewerProps {
  tableId: string;
  tableName: string;
  displayName: string;
}

export function MasterTableAuditViewer({ tableId, tableName, displayName }: MasterTableAuditViewerProps) {
  const [selectedLog, setSelectedLog] = useState<MasterTableAuditLog | null>(null);

  const { data: logs = [], isLoading } = useQuery<MasterTableAuditLog[]>({
    queryKey: [`/api/master-tables/${tableId}/audit-logs`],
    queryFn: async () => {
      const response = await fetch(`/api/master-tables/${tableId}/audit-logs`);
      if (!response.ok) throw new Error('Failed to fetch master table audit logs');
      return response.json();
    },
  });

  const getOperationBadge = (operation: string) => {
    const variants = {
      CREATE: "default" as const,
      UPDATE: "secondary" as const,
      DELETE: "destructive" as const,
    };
    return variants[operation as keyof typeof variants] || "outline";
  };

  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case 'CREATE': return '➕';
      case 'UPDATE': return '✏️';
      case 'DELETE': return '🗑️';
      default: return '📝';
    }
  };

  const formatRecordData = (jsonString: string | null) => {
    if (!jsonString) return null;
    try {
      const data = JSON.parse(jsonString);
      if (data.recordData) {
        return data.recordData;
      }
      return data;
    } catch {
      return jsonString;
    }
  };

  const renderValueComparison = (oldValues: string | null, newValues: string | null) => {
    const oldData = formatRecordData(oldValues);
    const newData = formatRecordData(newValues);

    return (
      <div className="space-y-4">
        {oldData && (
          <div>
            <h4 className="font-semibold text-sm text-red-600 mb-2">Previous Values:</h4>
            <div className="bg-red-50 p-3 rounded border">
              <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(oldData, null, 2)}</pre>
            </div>
          </div>
        )}
        
        {newData && (
          <div>
            <h4 className="font-semibold text-sm text-green-600 mb-2">New Values:</h4>
            <div className="bg-green-50 p-3 rounded border">
              <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(newData, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            {displayName} - Data Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading audit logs...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          {displayName} - Data Change History
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Complete audit trail for all create, update, and delete operations on {displayName} records
        </p>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No audit logs found for this master table data
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Total operations logged: {logs.length}
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Operation</TableHead>
                  <TableHead>Record ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Badge variant={getOperationBadge(log.operation)}>
                        {getOperationIcon(log.operation)} {log.operation}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.recordId.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="text-sm">{log.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        <span className="text-xs font-mono">{log.ipAddress}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-xs">
                          {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedLog(log)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Audit Log Details - {log.operation} Operation
                            </DialogTitle>
                          </DialogHeader>
                          
                          <div className="space-y-6">
                            {/* Operation Summary */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                              <div>
                                <label className="text-sm font-semibold">Operation Type:</label>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant={getOperationBadge(log.operation)}>
                                    {getOperationIcon(log.operation)} {log.operation}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-semibold">Table:</label>
                                <p className="text-sm mt-1">{displayName} ({tableName})</p>
                              </div>
                              <div>
                                <label className="text-sm font-semibold">User:</label>
                                <p className="text-sm mt-1">{log.username} ({log.userId})</p>
                              </div>
                              <div>
                                <label className="text-sm font-semibold">IP Address:</label>
                                <p className="text-sm font-mono mt-1">{log.ipAddress}</p>
                              </div>
                              <div>
                                <label className="text-sm font-semibold">Timestamp:</label>
                                <p className="text-sm mt-1">
                                  {format(new Date(log.timestamp), 'MMMM dd, yyyy HH:mm:ss')}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-semibold">Record ID:</label>
                                <p className="text-xs font-mono mt-1">{log.recordId}</p>
                              </div>
                            </div>

                            {/* User Agent */}
                            {log.userAgent && (
                              <div>
                                <label className="text-sm font-semibold">User Agent:</label>
                                <p className="text-xs text-muted-foreground mt-1">{log.userAgent}</p>
                              </div>
                            )}

                            {/* Data Changes */}
                            <div>
                              <h3 className="text-lg font-semibold mb-3">Data Changes</h3>
                              {renderValueComparison(log.oldValues, log.newValues)}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}