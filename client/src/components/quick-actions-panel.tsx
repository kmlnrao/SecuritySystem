import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/lib/api-client";
import { Plus, UserPlus, Edit, LogIn, UserX, ArrowRight } from "lucide-react";
import { z } from "zod";

const createUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  isActive: z.boolean().default(true),
});

type CreateUserData = z.infer<typeof createUserSchema>;

export function QuickActionsPanel() {
  const { toast } = useToast();
  
  const form = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      isActive: true,
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: CreateUserData) => {
      const response = await userService.createUser(userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User created successfully",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create user",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateUserData) => {
    createUserMutation.mutate(data);
  };

  const activities = [
    {
      id: 1,
      type: "user-plus",
      message: "Admin created new user account",
      timestamp: "2 minutes ago",
      icon: UserPlus,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: 2,
      type: "edit",
      message: "Admin updated role permissions",
      timestamp: "15 minutes ago",
      icon: Edit,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: 3,
      type: "login",
      message: "User logged in",
      timestamp: "1 hour ago",
      icon: LogIn,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      id: 4,
      type: "user-x",
      message: "System deactivated user account",
      timestamp: "3 hours ago",
      icon: UserX,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Add User Form */}
      <Card className="border border-slate-200">
        <CardHeader className="p-6">
          <CardTitle className="text-lg font-semibold text-slate-900">Quick Add User</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-slate-700">
                      Active user
                    </FormLabel>
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-accent text-white hover:bg-blue-600"
                disabled={createUserMutation.isPending}
              >
                <Plus className="h-4 w-4 mr-2" />
                {createUserMutation.isPending ? "Creating..." : "Create User"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border border-slate-200">
        <CardHeader className="p-6">
          <CardTitle className="text-lg font-semibold text-slate-900">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 ${activity.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-4 w-4 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">{activity.message}</p>
                    <p className="text-xs text-slate-500 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <Button variant="ghost" className="w-full mt-4 text-accent hover:text-blue-600 text-sm font-medium">
            View All Activity
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
