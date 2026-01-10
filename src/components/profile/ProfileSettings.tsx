import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Profile, LoginActivity } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Loader2, 
  Save, 
  Settings, 
  Bell, 
  Lock, 
  Shield,
  Monitor,
  Clock,
  MapPin,
  AlertTriangle
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface ProfileSettingsProps {
  profile: Profile | null;
  loginActivity: LoginActivity[];
  onUpdateNotifications: (preferences: Profile["notification_preferences"]) => Promise<{ success: boolean }>;
}

export function ProfileSettings({ profile, loginActivity, onUpdateNotifications }: ProfileSettingsProps) {
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [notifications, setNotifications] = useState(
    profile?.notification_preferences || {
      email_submissions: true,
      email_reviews: true,
      email_publications: true,
    }
  );

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleNotificationChange = async (key: keyof typeof notifications, value: boolean) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    
    setSavingNotifications(true);
    await onUpdateNotifications(updated);
    setSavingNotifications(false);
  };

  const handlePasswordChange = async (values: PasswordFormValues) => {
    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword,
      });

      if (error) throw error;

      toast.success("Password updated successfully");
      passwordForm.reset();
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Preferences */}
      <Card className="shadow-elegant">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-serif">Notification Preferences</CardTitle>
              <CardDescription>
                Choose what email notifications you want to receive
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-medium">Submission Updates</p>
              <p className="text-sm text-muted-foreground">
                Receive emails about your manuscript submissions
              </p>
            </div>
            <Switch
              checked={notifications.email_submissions}
              onCheckedChange={(checked) => handleNotificationChange("email_submissions", checked)}
              disabled={savingNotifications}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-medium">Review Assignments</p>
              <p className="text-sm text-muted-foreground">
                Receive emails when you're assigned to review a manuscript
              </p>
            </div>
            <Switch
              checked={notifications.email_reviews}
              onCheckedChange={(checked) => handleNotificationChange("email_reviews", checked)}
              disabled={savingNotifications}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-medium">Publication Announcements</p>
              <p className="text-sm text-muted-foreground">
                Receive emails when your articles are published
              </p>
            </div>
            <Switch
              checked={notifications.email_publications}
              onCheckedChange={(checked) => handleNotificationChange("email_publications", checked)}
              disabled={savingNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="shadow-elegant">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-serif">Change Password</CardTitle>
              <CardDescription>
                Update your account password
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormDescription>
                      Must be at least 6 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={savingPassword}>
                  {savingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Password
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Login Activity */}
      <Card className="shadow-elegant">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-serif">Login Activity</CardTitle>
              <CardDescription>
                Recent login sessions for your account
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {loginActivity.length > 0 ? (
            <div className="space-y-4">
              {loginActivity.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-muted/50"
                >
                  <div className="p-2 bg-background rounded-full">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">
                        {activity.user_agent?.includes("Mobile") ? "Mobile Device" : "Desktop"}
                      </p>
                      {index === 0 && (
                        <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full">
                          Current Session
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(activity.login_at), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                      {activity.ip_address && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {activity.ip_address}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No login activity recorded yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50 shadow-elegant">
        <CardHeader className="border-b border-destructive/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="font-serif text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions for your account
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button variant="destructive" disabled>
              Contact Admin
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
