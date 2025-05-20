import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { BellRing, Shield, Smartphone, Loader2, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("notifications");
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dueReminders, setDueReminders] = useState(true);
  const [newArrivals, setNewArrivals] = useState(false);
  const [newsLetters, setNewsLetters] = useState(true);
  
  // Privacy settings
  const [showHistory, setShowHistory] = useState(false);
  const [shareData, setShareData] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  
  // Security settings
  const [loginAlerts, setLoginAlerts] = useState(true);

  const handleSave = () => {
    setIsUpdating(true);
    
    // Simulate API call to save settings
    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: "Settings updated",
        description: "Your settings have been successfully saved.",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>
                    Customize your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs 
                    orientation="vertical" 
                    value={activeTab} 
                    onValueChange={setActiveTab} 
                    className="w-full"
                  >
                    <TabsList className="flex flex-col h-auto bg-transparent border-r w-full justify-start items-start rounded-none">
                      <TabsTrigger 
                        value="notifications" 
                        className="w-full justify-start px-6 py-3 data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-none border-b"
                      >
                        <BellRing className="h-4 w-4 mr-2" />
                        Notifications
                      </TabsTrigger>
                      <TabsTrigger 
                        value="privacy" 
                        className="w-full justify-start px-6 py-3 data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-none border-b"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Privacy
                      </TabsTrigger>
                      <TabsTrigger 
                        value="security" 
                        className="w-full justify-start px-6 py-3 data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-none"
                      >
                        <Smartphone className="h-4 w-4 mr-2" />
                        Security
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <Card>
                <Tabs value={activeTab} className="w-full">
                  <TabsContent value="notifications" className="m-0">
                    <CardHeader>
                      <CardTitle>Notification Settings</CardTitle>
                      <CardDescription>
                        Manage how and when you receive notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive emails about your account activity</p>
                          </div>
                          <Switch 
                            id="email-notifications" 
                            checked={emailNotifications} 
                            onCheckedChange={setEmailNotifications} 
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="due-reminders" className="text-base">Due Date Reminders</Label>
                            <p className="text-sm text-muted-foreground">Get notified when your books are due soon</p>
                          </div>
                          <Switch 
                            id="due-reminders" 
                            checked={dueReminders} 
                            onCheckedChange={setDueReminders} 
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="new-arrivals" className="text-base">New Arrivals</Label>
                            <p className="text-sm text-muted-foreground">Receive updates about new books in our collection</p>
                          </div>
                          <Switch 
                            id="new-arrivals" 
                            checked={newArrivals} 
                            onCheckedChange={setNewArrivals} 
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="newsletters" className="text-base">Library Newsletters</Label>
                            <p className="text-sm text-muted-foreground">Receive monthly newsletters about library events</p>
                          </div>
                          <Switch 
                            id="newsletters" 
                            checked={newsLetters} 
                            onCheckedChange={setNewsLetters} 
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4">
                        <Button onClick={handleSave} disabled={isUpdating}>
                          {isUpdating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </TabsContent>
                  
                  <TabsContent value="privacy" className="m-0">
                    <CardHeader>
                      <CardTitle>Privacy Settings</CardTitle>
                      <CardDescription>
                        Control your data and privacy preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="show-history" className="text-base">Reading History</Label>
                            <p className="text-sm text-muted-foreground">Allow library staff to view your borrowing history</p>
                          </div>
                          <Switch 
                            id="show-history" 
                            checked={showHistory} 
                            onCheckedChange={setShowHistory} 
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="share-data" className="text-base">Data Usage</Label>
                            <p className="text-sm text-muted-foreground">Help improve our services by sharing anonymous usage data</p>
                          </div>
                          <Switch 
                            id="share-data" 
                            checked={shareData} 
                            onCheckedChange={setShareData} 
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="two-factor" className="text-base">Two-Factor Authentication</Label>
                            <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                          </div>
                          <Switch 
                            id="two-factor" 
                            checked={twoFactorAuth} 
                            onCheckedChange={setTwoFactorAuth} 
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4">
                        <Button onClick={handleSave} disabled={isUpdating}>
                          {isUpdating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </TabsContent>
                  
                  <TabsContent value="security" className="m-0">
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>
                        Manage your account security preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="login-alerts" className="text-base">Login Alerts</Label>
                            <p className="text-sm text-muted-foreground">Receive notifications for new login activity</p>
                          </div>
                          <Switch 
                            id="login-alerts" 
                            checked={loginAlerts} 
                            onCheckedChange={setLoginAlerts} 
                          />
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-base font-medium mb-2">Connected Devices</h3>
                          <div className="bg-muted p-4 rounded-md">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Chrome on Windows</p>
                                <p className="text-sm text-muted-foreground">Last active: Today, 10:30 AM</p>
                              </div>
                              <Button variant="outline" size="sm">Sign Out</Button>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-base font-medium mb-2">Account Actions</h3>
                          <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-start">Reset Password</Button>
                            <Button variant="outline" className="w-full justify-start text-destructive">Delete Account</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4">
                        <Button onClick={handleSave} disabled={isUpdating}>
                          {isUpdating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}