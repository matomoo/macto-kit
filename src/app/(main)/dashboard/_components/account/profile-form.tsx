"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useProfile } from "@/hooks/use-profile";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(50, { message: "Username must not exceed 50 characters" })
    .regex(/^[a-zA-Z0-9_-]+$/, { message: "Username can only contain letters, numbers, underscores, and hyphens" })
    .nullable()
    .optional(),
  full_name: z.string().max(100, { message: "Full name must not exceed 100 characters" }).nullable().optional(),
  website: z.string().url({ message: "Please enter a valid URL" }).nullable().optional().or(z.literal("")),
  avatar_url: z.string().nullable().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { profile, updating, updateProfile } = useProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      full_name: "",
      website: "",
      avatar_url: "",
    },
  });

  // Populate form with existing profile data
  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || "",
        full_name: profile.full_name || "",
        website: profile.website || "",
        avatar_url: profile.avatar_url || "",
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfile({
        username: data.username || null,
        full_name: data.full_name || null,
        website: data.website || null,
        avatar_url: data.avatar_url || null,
      });
    } catch {
      // Error is already handled in the hook
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="john_doe" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>
                Your unique username for your public profile. Must be at least 3 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>Your full name as you'd like it displayed.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://example.com" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>Your personal website or portfolio URL.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatar_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://example.com/avatar.jpg" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>URL to your profile picture or avatar image.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={updating}>
          {updating ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
