"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useAuthStore } from "@/stores/auth-store";

import { ProfileForm } from "../_components/account/profile-form";

export default function AccountPage() {
  const { loading } = useRequireAuth();
  const { user } = useAuthStore();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Account Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your profile and account preferences</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal profile details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Email Section (Read-only) */}
            <div className="space-y-2 border-b pb-6">
              <label
                htmlFor="email"
                className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Email Address
              </label>
              <p id="email" className="text-muted-foreground text-sm">
                {user?.email}
              </p>
              <p className="text-muted-foreground text-xs">
                Your email address cannot be changed. Contact support if you need to update it.
              </p>
            </div>

            {/* Profile Form */}
            <ProfileForm />
          </div>
        </CardContent>
      </Card>

      {/* Additional Settings Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Password & Security</CardTitle>
          <CardDescription>Manage your password and security settings</CardDescription>
        </CardHeader>
        <CardContent>
          <button type="button" className="text-primary text-sm hover:underline">
            Change Password
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
