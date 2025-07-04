import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SystemPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">System Administration</h2>
      </div>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Configure system-wide settings and administrative controls.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}