import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InsertUser } from "@shared/schema";

// Login form schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Registration form schema
const registrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  adminSecret: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const { user, loginMutation, registerMutation, adminRegisterMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { search } = useLocation()[0];
  
  // Parse query parameters to determine initial tab
  useEffect(() => {
    if (search) {
      const params = new URLSearchParams(search);
      const tab = params.get("tab");
      if (tab === "signup") {
        setActiveTab("register");
      }
    }
  }, [search]);
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  // Registration form
  const registerForm = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      adminSecret: "",
    },
  });
  
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };
  
  const onRegisterSubmit = (data: RegistrationFormValues) => {
    const { confirmPassword, adminSecret, ...userData } = data;
    
    if (isAdminMode && adminSecret) {
      // Handle admin registration
      adminRegisterMutation.mutate({ ...userData, adminSecret } as InsertUser & { adminSecret: string });
    } else {
      // Handle regular user registration
      registerMutation.mutate(userData as InsertUser);
    }
  };
  
  // Toggle between admin and regular user registration
  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
  };
  
  if (user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-50">
      <div className="w-full max-w-5xl flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden">
        {/* Left side - Auth Forms */}
        <div className="w-full md:w-1/2 bg-white p-8">
          <div className="flex flex-col items-center mb-6">
            <BookOpen className="h-10 w-10 text-primary mb-2" />
            <h1 className="text-2xl font-bold text-neutral-800">LibraryHub</h1>
            <p className="text-neutral-500 text-sm mt-1">Your gateway to knowledge and imagination</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="register">Create Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
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
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <div className="flex justify-end mt-1">
                          <a href="#" className="text-xs text-primary hover:text-primary-dark">
                            Forgot password?
                          </a>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-white" 
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Log in"
                    )}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-neutral-600">
                  Don't have an account?{" "}
                  <Button 
                    variant="link" 
                    className="text-primary p-0"
                    onClick={() => setActiveTab("register")}
                  >
                    Sign up
                  </Button>
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  {/* Admin mode toggle */}
                  <div className="border rounded-md p-3 mb-4 bg-neutral-50">
                    <Label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm font-medium">Administrator Registration</span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isAdminMode}
                          onChange={toggleAdminMode}
                        />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${isAdminMode ? 'bg-primary' : 'bg-neutral-300'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${isAdminMode ? 'translate-x-4' : ''}`}></div>
                      </div>
                    </Label>
                    {isAdminMode && (
                      <p className="text-xs text-neutral-600 mt-2">
                        Administrator accounts have full control over the library system. Requires an admin secret key.
                      </p>
                    )}
                  </div>
                
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
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
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <p className="text-xs text-neutral-500 mt-1">
                          Must be at least 8 characters with a number and a special character
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Admin secret key field */}
                  {isAdminMode && (
                    <FormField
                      control={registerForm.control}
                      name="adminSecret"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admin Secret Key</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter admin secret key" {...field} />
                          </FormControl>
                          <p className="text-xs text-neutral-500 mt-1">
                            Contact your system administrator to obtain a valid admin secret key
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <div className="mb-6">
                    <Label className="flex items-start">
                      <input type="checkbox" className="mt-1 h-4 w-4 text-primary" />
                      <span className="ml-2 text-sm text-neutral-600">
                        I agree to the <a href="#" className="text-primary hover:text-primary-dark">Terms of Service</a> and <a href="#" className="text-primary hover:text-primary-dark">Privacy Policy</a>
                      </span>
                    </Label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-white" 
                    disabled={isAdminMode ? adminRegisterMutation.isPending : registerMutation.isPending}
                  >
                    {isAdminMode ? (
                      adminRegisterMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Admin Account...
                        </>
                      ) : (
                        "Create Administrator Account"
                      )
                    ) : (
                      registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )
                    )}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-neutral-600">
                  Already have an account?{" "}
                  <Button 
                    variant="link" 
                    className="text-primary p-0"
                    onClick={() => setActiveTab("login")}
                  >
                    Log in
                  </Button>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right side - Hero */}
        <div className="hidden md:block w-1/2 bg-primary text-white p-8">
          <div className="h-full flex flex-col items-center justify-center">
            <BookOpen className="h-16 w-16 mb-6" />
            <h2 className="text-3xl font-bold mb-4 text-center">Welcome to LibraryHub</h2>
            <p className="text-center mb-6 max-w-md">
              Discover a world of books at your fingertips. Browse our collection, borrow books, and track your reading journey.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <Card className="bg-white bg-opacity-10 border-0">
                <CardContent className="p-4 text-center">
                  <h3 className="font-bold text-xl mb-1">5,000+</h3>
                  <p className="text-sm">Books Available</p>
                </CardContent>
              </Card>
              <Card className="bg-white bg-opacity-10 border-0">
                <CardContent className="p-4 text-center">
                  <h3 className="font-bold text-xl mb-1">Free</h3>
                  <p className="text-sm">Membership</p>
                </CardContent>
              </Card>
              <Card className="bg-white bg-opacity-10 border-0">
                <CardContent className="p-4 text-center">
                  <h3 className="font-bold text-xl mb-1">24/7</h3>
                  <p className="text-sm">Online Access</p>
                </CardContent>
              </Card>
              <Card className="bg-white bg-opacity-10 border-0">
                <CardContent className="p-4 text-center">
                  <h3 className="font-bold text-xl mb-1">Easy</h3>
                  <p className="text-sm">Book Borrowing</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
