import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { History, Eye, User, Globe, Calendar } from "lucide-react";
import { format } from "date-fns";

interface AuditLog {
  id: string;
  tableName: string;
  recordId: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  operationType: 'MASTER_TABLE_CONFIG' | 'MASTER_DATA_RECORD';
  oldValues?: string;
  newValues?: string;
  userId: string;
  username: string;
  ipAddress: string;
  userAgent?: string;
  timestamp: string;
}

interface AuditLogViewerProps {
  tableName?: string;
  recordId?: string;
  title?: string;
}

export function AuditLogViewer({ tableName, recordId, title = "Audit Logs" }: AuditLogViewerProps) {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const { data: logs = [], isLoading } = useQuery<AuditLog[]>({
    queryKey: ["/api/audit-logs", { tableName, recordId }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (tableName) params.append('tableName', tableName);
      if (recordId) params.append('recordId', recordId);
      
      const response = await fetch(`/api/audit-logs?${params}`);
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      return response.json();
    },
  });

  const getOperationBadge = (operation: string) => {
    const variants = {
      CREATE: "default" as const,
      UPDATE: "secondary" as const,
      DELETE: "destructive" as const,
    };
    return <Badge variant={variants[operation as keyof typeof variants] || "outline"}>{operation}</Badge>;
  };

  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), "MMM dd, yyyy 'at' HH:mm:ss");
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading audit logs...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          {title}
          <Badge variant="outline">{logs.length} entries</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No audit logs found for the specified criteria.
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Operation</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{getOperationBadge(log.operation)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {log.operationType.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{log.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span className="font-mono text-sm">{log.ipAddress}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{formatTimestamp(log.timestamp)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedLog(log)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Audit Log Details</DialogTitle>
                          </DialogHeader>
                          <AuditLogDetails log={log} />
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

function AuditLogDetails({ log }: { log: AuditLog }) {
  const oldValues = log.oldValues ? JSON.parse(log.oldValues) : null;
  const newValues = log.newValues ? JSON.parse(log.newValues) : null;

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Operation Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <strong>Operation:</strong> {log.operation}
          </div>
          <div>
            <strong>Type:</strong> {log.operationType.replace('_', ' ')}
          </div>
          <div>
            <strong>User:</strong> {log.username}
          </div>
          <div>
            <strong>User ID:</strong> {log.userId}
          </div>
          <div>
            <strong>IP Address:</strong> {log.ipAddress}
          </div>
          <div>
            <strong>Timestamp:</strong> {formatTimestamp(log.timestamp)}
          </div>
          {log.userAgent && (
            <div className="col-span-2">
              <strong>User Agent:</strong> 
              <div className="text-sm text-muted-foreground mt-1 font-mono">
                {log.userAgent}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Changes */}
      {(oldValues || newValues) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {oldValues && (
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Previous Values</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-muted p-3 rounded overflow-auto">
                  {JSON.stringify(oldValues, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {newValues && (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">New Values</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-muted p-3 rounded overflow-auto">
                  {JSON.stringify(newValues, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function formatTimestamp(timestamp: string) {
  return format(new Date(timestamp), "PPpp");
}