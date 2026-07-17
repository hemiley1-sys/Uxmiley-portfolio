import { useGetContact, useUpdateContact, getGetContactQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const contactSchema = z.object({
  email: z.string().email("Valid email is required"),
  location: z.string().min(1, "Location is required"),
  timezone: z.string().min(1, "Timezone is required"),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  dribbble: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function AdminContact() {
  const { data: contact, isLoading } = useGetContact();
  const updateContact = useUpdateContact();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: "",
      location: "",
      timezone: "",
      twitter: "",
      linkedin: "",
      github: "",
      dribbble: "",
    },
  });

  useEffect(() => {
    if (contact) {
      form.reset({
        email: contact.email || "",
        location: contact.location || "",
        timezone: contact.timezone || "",
        twitter: contact.twitter || "",
        linkedin: contact.linkedin || "",
        github: contact.github || "",
        dribbble: contact.dribbble || "",
      });
    }
  }, [contact, form]);

  const onSubmit = (data: ContactFormValues) => {
    updateContact.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "Contact info updated successfully" });
        queryClient.invalidateQueries({ queryKey: getGetContactQueryKey() });
      },
      onError: () => {
        toast({ title: "Failed to update contact info", variant: "destructive" });
      }
    });
  };

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-10 w-48" /><Skeleton className="h-[500px] w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Contact Info</h1>
        <p className="text-muted-foreground mt-2">Manage your public contact details and social links.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-border pb-2">Primary Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Public Email</FormLabel>
                      <FormControl><Input type="email" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. San Francisco, CA" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. PST (UTC-8)" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-border pb-2">Social Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter (X) URL</FormLabel>
                      <FormControl><Input {...field} placeholder="https://twitter.com/..." /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL</FormLabel>
                      <FormControl><Input {...field} placeholder="https://linkedin.com/in/..." /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL</FormLabel>
                      <FormControl><Input {...field} placeholder="https://github.com/..." /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dribbble"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dribbble URL</FormLabel>
                      <FormControl><Input {...field} placeholder="https://dribbble.com/..." /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <Button type="submit" disabled={updateContact.isPending}>
                {updateContact.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}