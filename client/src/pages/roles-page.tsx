import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RolesPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Role Management</h2>
      </div>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Hospital Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Manage user roles and permissions for the hospital system.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}