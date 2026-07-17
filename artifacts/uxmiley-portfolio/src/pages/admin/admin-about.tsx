import { useGetAbout, useUpdateAbout, getGetAboutQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2 } from "lucide-react";

const aboutSchema = z.object({
  bio1: z.string().min(1, "Primary bio is required"),
  bio2: z.string().optional(),
  stats: z.array(z.object({
    value: z.string().min(1, "Value required"),
    label: z.string().min(1, "Label required")
  }))
});

type AboutFormValues = z.infer<typeof aboutSchema>;

export default function AdminAbout() {
  const { data: about, isLoading } = useGetAbout();
  const updateAbout = useUpdateAbout();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<AboutFormValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      bio1: "",
      bio2: "",
      stats: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "stats",
  });

  useEffect(() => {
    if (about) {
      form.reset({
        bio1: about.bio1 || "",
        bio2: about.bio2 || "",
        stats: about.stats || [],
      });
    }
  }, [about, form]);

  const onSubmit = (data: AboutFormValues) => {
    updateAbout.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "About updated successfully" });
        queryClient.invalidateQueries({ queryKey: getGetAboutQueryKey() });
      },
      onError: () => {
        toast({ title: "Failed to update about", variant: "destructive" });
      }
    });
  };

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-10 w-48" /><Skeleton className="h-[500px] w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">About Section</h1>
        <p className="text-muted-foreground mt-2">Manage your biography and key statistics.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-medium border-b border-border pb-2">Biography</h3>
              <FormField
                control={form.control}
                name="bio1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Bio (Paragraph 1)</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Bio (Paragraph 2)</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="text-lg font-medium">Statistics</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => append({ value: "", label: "" })}
                >
                  <Plus size={16} className="mr-2" /> Add Stat
                </Button>
              </div>

              {fields.length === 0 ? (
                <div className="text-center p-8 bg-muted/20 border border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground">No statistics added yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-start">
                      <FormField
                        control={form.control}
                        name={`stats.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="sr-only">Value</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. 7+" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`stats.${index}.label`}
                        render={({ field }) => (
                          <FormItem className="flex-[2]">
                            <FormLabel className="sr-only">Label</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. Years Experience" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
                        onClick={() => remove(index)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <Button type="submit" disabled={updateAbout.isPending}>
                {updateAbout.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}