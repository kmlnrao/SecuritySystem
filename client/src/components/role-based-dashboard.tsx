import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Shield, 
  Calendar, 
  Activity, 
  FileText, 
  Settings,
  UserPlus,
  ClipboardList,
  Heart,
  Pill,
  TestTube,
  Stethoscope,
  AlertCircle
} from "lucide-react";

interface DashboardWidget {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  action?: string;
  roleRequired?: string;
  permissionRequired?: string;
}

const roleBasedWidgets: Record<string, DashboardWidget[]> = {
  'Super Admin': [
    {
      id: 'user-management',
      title: 'User Management',
      description: 'Manage hospital staff and user accounts',
      icon: 'Users',
      color: 'blue',
      action: 'users'
    },
    {
      id: 'role-management',
      title: 'Role Management',
      description: 'Configure user roles and permissions',
      icon: 'Shield',
      color: 'purple',
      action: 'roles'
    },
    {
      id: 'system-settings',
      title: 'System Settings',
      description: 'Configure system-wide settings',
      icon: 'Settings',
      color: 'gray',
      action: 'system'
    },
    {
      id: 'permissions',
      title: 'Permission Management',
      description: 'Manage document and module permissions',
      icon: 'FileText',
      color: 'green',
      action: 'permissions'
    }
  ],
  'Administrator': [
    {
      id: 'user-management',
      title: 'User Management',
      description: 'Manage hospital staff accounts',
      icon: 'Users',
      color: 'blue',
      action: 'users'
    },
    {
      id: 'patient-overview',
      title: 'Patient Overview',
      description: 'View patient statistics and reports',
      icon: 'Activity',
      color: 'green'
    },
    {
      id: 'appointment-summary',
      title: 'Appointment Summary',
      description: 'Today\'s appointment overview',
      icon: 'Calendar',
      color: 'orange'
    }
  ],
  'Doctor': [
    {
      id: 'appointments-today',
      title: 'Today\'s Appointments',
      description: 'View and manage your appointments',
      icon: 'Calendar',
      color: 'blue'
    },
    {
      id: 'patient-records',
      title: 'Patient Records',
      description: 'Access patient medical records',
      icon: 'Heart',
      color: 'red'
    },
    {
      id: 'prescriptions',
      title: 'Prescriptions',
      description: 'Manage patient prescriptions',
      icon: 'Pill',
      color: 'green'
    },
    {
      id: 'lab-results',
      title: 'Lab Results',
      description: 'Review laboratory test results',
      icon: 'TestTube',
      color: 'purple'
    }
  ],
  'Nurse': [
    {
      id: 'patient-care',
      title: 'Patient Care',
      description: 'Manage patient care activities',
      icon: 'Heart',
      color: 'pink'
    },
    {
      id: 'medication-admin',
      title: 'Medication Administration',
      description: 'Track medication schedules',
      icon: 'Pill',
      color: 'blue'
    },
    {
      id: 'vital-signs',
      title: 'Vital Signs',
      description: 'Record patient vital signs',
      icon: 'Activity',
      color: 'green'
    }
  ],
  'Staff': [
    {
      id: 'appointments',
      title: 'Appointments',
      description: 'Schedule and manage appointments',
      icon: 'Calendar',
      color: 'blue'
    },
    {
      id: 'patient-registration',
      title: 'Patient Registration',
      description: 'Register new patients',
      icon: 'UserPlus',
      color: 'green'
    }
  ],
  'Receptionist': [
    {
      id: 'appointments',
      title: 'Appointments',
      description: 'Schedule and manage appointments',
      icon: 'Calendar',
      color: 'blue'
    },
    {
      id: 'patient-registration',
      title: 'Patient Registration',
      description: 'Register new patients',
      icon: 'UserPlus',
      color: 'green'
    },
    {
      id: 'check-in',
      title: 'Patient Check-in',
      description: 'Check-in arriving patients',
      icon: 'ClipboardList',
      color: 'orange'
    }
  ]
};

const iconComponents = {
  Users,
  Shield,
  Calendar,
  Activity,
  FileText,
  Settings,
  UserPlus,
  ClipboardList,
  Heart,
  Pill,
  TestTube,
  Stethoscope,
  AlertCircle
};

const colorClasses = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  pink: 'bg-pink-500',
  gray: 'bg-gray-500'
};

export function RoleBasedDashboard() {
  const { user } = useAuth();

  const { data: userRoles = [] } = useQuery({
    queryKey: ["/api/users", user?.id, "roles"],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await fetch(`/api/users/${user.id}/roles`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        }
      });
      if (!response.ok) return [];
      return await response.json();
    },
    enabled: !!user?.id
  });

  const { data: generalStats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        }
      });
      if (!response.ok) return {};
      return await response.json();
    }
  });

  // Get widgets based on user roles
  const getUserWidgets = () => {
    const widgets: DashboardWidget[] = [];
    
    userRoles.forEach((role: any) => {
      const roleWidgets = roleBasedWidgets[role.name] || [];
      roleWidgets.forEach(widget => {
        if (!widgets.find(w => w.id === widget.id)) {
          widgets.push(widget);
        }
      });
    });

    return widgets;
  };

  const widgets = getUserWidgets();

  const handleWidgetClick = (action?: string) => {
    if (action && (window as any).setDashboardView) {
      (window as any).setDashboardView(action);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.username}
          </h2>
          <p className="text-muted-foreground">
            {userRoles.length > 0 
              ? `Role: ${userRoles.map((r: any) => r.name).join(', ')}`
              : 'Hospital Management System'
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {userRoles.map((role: any) => (
            <Badge key={role.id} variant="secondary">
              {role.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Role-based Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {widgets.map(widget => {
          const IconComponent = iconComponents[widget.icon as keyof typeof iconComponents] || FileText;
          const colorClass = colorClasses[widget.color as keyof typeof colorClasses] || colorClasses.gray;
          
          return (
            <Card 
              key={widget.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${widget.action ? 'hover:bg-gray-50' : ''}`}
              onClick={() => handleWidgetClick(widget.action)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
                <div className={`h-8 w-8 rounded-full ${colorClass} flex items-center justify-center`}>
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{widget.description}</p>
                {widget.action && (
                  <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto">
                    <span className="text-xs">View →</span>
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* General Statistics - if user has appropriate permissions */}
      {userRoles.some((role: any) => ['Super Admin', 'Administrator'].includes(role.name)) && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{generalStats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">Registered in system</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{generalStats?.activePatients || 0}</div>
              <p className="text-xs text-muted-foreground">Currently registered</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{generalStats?.todayAppointments || 0}</div>
              <p className="text-xs text-muted-foreground">Scheduled for today</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{generalStats?.pendingTasks || 0}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}