import { Sidebar } from "@/components/sidebar";
import { DashboardStats } from "@/components/dashboard-stats";
import { UserManagementTable } from "@/components/user-management-table";
import { QuickActionsPanel } from "@/components/quick-actions-panel";
import { Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex items-center space-x-2 text-sm text-slate-500">
                <span>Dashboard</span>
                <span className="text-xs">/</span>
                <span className="text-slate-900 font-medium">Overview</span>
              </nav>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">System Overview</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-600">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
              
              <Button className="bg-accent text-white hover:bg-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <DashboardStats />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2">
              <UserManagementTable />
            </div>
            <div>
              <QuickActionsPanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
