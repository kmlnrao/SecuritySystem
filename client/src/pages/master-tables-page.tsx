import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Database, Table, Plus, History } from "lucide-react";
import { MasterTableConfigurationPage } from "@/components/master-table-config";
import { DynamicMasterTable } from "@/components/dynamic-master-table";
import { AuditLogViewer } from "@/components/audit-log-viewer";

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

export default function MasterTablesPage() {
  const [selectedTable, setSelectedTable] = useState<MasterTableConfig | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: configs = [], isLoading } = useQuery<MasterTableConfig[]>({
    queryKey: ["/api/master-tables"],
  });

  const activeConfigs = configs.filter(config => config.isActive);

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading master tables...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Master Tables</h1>
          <p className="text-muted-foreground">
            Manage dynamic master tables and their data for your hospital system
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            Data Management
          </TabsTrigger>
          <TabsTrigger value="configuration" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{configs.length}</div>
                <p className="text-xs text-muted-foreground">
                  {activeConfigs.length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Tables</CardTitle>
                <Table className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeConfigs.length}</div>
                <p className="text-xs text-muted-foreground">
                  Ready for data entry
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setActiveTab("configuration")}
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    New Table
                  </Button>
                  {activeConfigs.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        setSelectedTable(activeConfigs[0]);
                        setActiveTab("data");
                      }}
                    >
                      <Table className="mr-2 h-3 w-3" />
                      Manage Data
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {activeConfigs.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Active Master Tables</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeConfigs.map((config) => {
                  const columns = JSON.parse(config.columns);
                  return (
                    <Card key={config.id} className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => {
                            setSelectedTable(config);
                            setActiveTab("data");
                          }}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{config.displayName}</CardTitle>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {config.description || `Manage ${config.displayName} records`}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {columns.length} columns
                          </span>
                          <Button variant="ghost" size="sm">
                            Manage →
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {activeConfigs.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Database className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Master Tables</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first master table configuration to start managing dynamic data.
                </p>
                <Button onClick={() => setActiveTab("configuration")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Master Table
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          {selectedTable ? (
            <DynamicMasterTable tableConfig={selectedTable} />
          ) : activeConfigs.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">Select a Master Table</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeConfigs.map((config) => (
                  <Card key={config.id} className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedTable(config)}>
                    <CardHeader>
                      <CardTitle className="text-base">{config.displayName}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {config.description || `Manage ${config.displayName} records`}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" size="sm" className="w-full">
                        Select Table
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Table className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Master Tables Available</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create a master table configuration first to manage data.
                </p>
                <Button onClick={() => setActiveTab("configuration")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Master Table
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="configuration">
          <MasterTableConfigurationPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}