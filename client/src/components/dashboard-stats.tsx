import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Shield, Puzzle, LogIn, TrendingUp, Minus } from "lucide-react";

export function DashboardStats() {
  const { data: users = [] } = useQuery({ queryKey: ["/api/users"] });
  const { data: roles = [] } = useQuery({ queryKey: ["/api/roles"] });
  const { data: modules = [] } = useQuery({ queryKey: ["/api/modules"] });

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      change: "+12%",
      changeType: "increase" as const,
      icon: Users,
      bgColor: "bg-blue-100",
      iconColor: "text-accent",
    },
    {
      title: "Active Roles",
      value: roles.length,
      change: "+3%",
      changeType: "increase" as const,
      icon: Shield,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "System Modules",
      value: modules.length,
      change: "0%",
      changeType: "neutral" as const,
      icon: Puzzle,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Login Sessions",
      value: users.filter(u => u.isActive).length,
      change: "+8%",
      changeType: "increase" as const,
      icon: LogIn,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const ChangeIcon = stat.changeType === "increase" ? TrendingUp : 
                          stat.changeType === "decrease" ? TrendingUp : Minus;
        
        return (
          <Card key={stat.title} className="border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium flex items-center ${
                      stat.changeType === "increase" ? "text-green-600" : 
                      stat.changeType === "decrease" ? "text-red-600" : "text-slate-500"
                    }`}>
                      <ChangeIcon className="h-3 w-3 mr-1" />
                      {stat.change}
                    </span>
                    <span className="text-slate-500 text-sm ml-2">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
