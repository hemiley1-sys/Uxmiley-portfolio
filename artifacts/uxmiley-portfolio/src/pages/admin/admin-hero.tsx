import { useGetHero, useUpdateHero, getGetHeroQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const heroSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  tagline: z.string().min(1, "Tagline is required"),
  location: z.string().optional(),
  availabilityStatus: z.string().optional(),
  ctaLabel: z.string().optional(),
  resumeUrl: z.string().optional(),
});

type HeroFormValues = z.infer<typeof heroSchema>;

export default function AdminHero() {
  const { data: hero, isLoading } = useGetHero();
  const updateHero = useUpdateHero();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<HeroFormValues>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      name: "",
      role: "",
      tagline: "",
      location: "",
      availabilityStatus: "",
      ctaLabel: "",
      resumeUrl: "",
    },
  });

  useEffect(() => {
    if (hero) {
      form.reset({
        name: hero.name || "",
        role: hero.role || "",
        tagline: hero.tagline || "",
        location: hero.location || "",
        availabilityStatus: hero.availabilityStatus || "",
        ctaLabel: hero.ctaLabel || "",
        resumeUrl: hero.resumeUrl || "",
      });
    }
  }, [hero, form]);

  const onSubmit = (data: HeroFormValues) => {
    updateHero.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "Hero updated successfully" });
        queryClient.invalidateQueries({ queryKey: getGetHeroQueryKey() });
      },
      onError: (error) => {
        toast({ title: "Failed to update hero", variant: "destructive" });
      }
    });
  };

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-10 w-48" /><Skeleton className="h-[500px] w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Hero Section</h1>
        <p className="text-muted-foreground mt-2">Manage the main introduction of your portfolio.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Your name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Senior Product Designer" />
                    </FormControl>
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
                    <FormControl>
                      <Input {...field} placeholder="e.g. San Francisco, CA" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availabilityStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability Status</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Available for new opportunities" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tagline (Hero Main Heading)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Your main hero heading (newlines create breaks)"
                      rows={4}
                      className="font-mono text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="ctaLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CTA Button Label</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. View Work" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resumeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resume URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. /resume.pdf" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <Button type="submit" disabled={updateHero.isPending}>
                {updateHero.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}