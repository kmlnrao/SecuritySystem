import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { z } from "zod";
import { Hospital, Users, Shield, Settings, UserCheck, Stethoscope, Heart, Pill, TestTube, Crown } from "lucide-react";

const loginSchema = insertUserSchema.pick({ username: true, password: true });
const registerSchema = insertUserSchema.extend({
  email: z.string().email("Please enter a valid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("login");

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const onLogin = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  const onRegister = (data: RegisterData) => {
    registerMutation.mutate(data);
  };

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4">
              <Hospital className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">HMS Admin Portal</h1>
            <p className="text-slate-600 mt-2">Hospital Management Authentication System</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>
                    Enter your credentials to access the admin dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-accent hover:bg-blue-600"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Signing in..." : "Sign in"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Sample Login Credentials */}
              <Card className="mt-4 border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-blue-800 flex items-center">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Sample Hospital Accounts
                  </CardTitle>
                  <CardDescription className="text-xs text-blue-600">
                    Click any account below to auto-fill login credentials
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {[
                      { 
                        username: "superadmin", 
                        password: "SuperAdmin@2024!", 
                        role: "Super Admin", 
                        icon: Crown,
                        color: "text-purple-600 bg-purple-100"
                      },
                      { 
                        username: "admin", 
                        password: "password123", 
                        role: "Admin", 
                        icon: Shield,
                        color: "text-red-600 bg-red-100"
                      },
                      { 
                        username: "dr.smith", 
                        password: "password123", 
                        role: "Doctor", 
                        icon: Stethoscope,
                        color: "text-green-600 bg-green-100"
                      },
                      { 
                        username: "nurse.jane", 
                        password: "password123", 
                        role: "Nurse", 
                        icon: Heart,
                        color: "text-blue-600 bg-blue-100"
                      },
                      { 
                        username: "staff.john", 
                        password: "password123", 
                        role: "Staff", 
                        icon: Pill,
                        color: "text-orange-600 bg-orange-100"
                      },
                      { 
                        username: "reception.mary", 
                        password: "password123", 
                        role: "Reception", 
                        icon: Users,
                        color: "text-indigo-600 bg-indigo-100"
                      }
                    ].map((account, index) => {
                      const Icon = account.icon;
                      return (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start h-auto p-2 text-left hover:bg-blue-100"
                          onClick={() => {
                            loginForm.setValue("username", account.username);
                            loginForm.setValue("password", account.password);
                          }}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${account.color}`}>
                            <Icon className="h-3 w-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-slate-900">{account.username}</div>
                            <div className="text-xs text-slate-500">{account.role}</div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create account</CardTitle>
                  <CardDescription>
                    Set up a new admin account for the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Choose a username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Create a password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-accent hover:bg-blue-600"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Creating account..." : "Create account"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Hero section */}
      <div className="flex-1 bg-primary text-white flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <h2 className="text-3xl font-bold mb-6">Secure Healthcare Management</h2>
          <p className="text-slate-300 mb-8 leading-relaxed">
            Advanced role-based access control system for hospitals. Manage users, permissions, 
            and system modules with enterprise-grade security.
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-accent" />
              <span>User Management</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-accent" />
              <span>Role-Based Access</span>
            </div>
            <div className="flex items-center space-x-2">
              <Hospital className="h-5 w-5 text-accent" />
              <span>Healthcare Focused</span>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-accent" />
              <span>System Administration</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
