import { useListExperiences, useCreateExperience, useUpdateExperience, useDeleteExperience, getListExperiencesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit2, Trash2 } from "lucide-react";

const experienceSchema = z.object({
  year: z.string().min(1, "Year range is required"),
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  desc: z.string().min(1, "Description is required"),
  sortOrder: z.coerce.number().default(0),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

export default function AdminExperience() {
  const { data: experiences, isLoading } = useListExperiences();
  const createExperience = useCreateExperience();
  const updateExperience = useUpdateExperience();
  const deleteExperience = useDeleteExperience();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      year: "",
      role: "",
      company: "",
      desc: "",
      sortOrder: 0,
    },
  });

  const openAdd = () => {
    setEditingId(null);
    form.reset({
      year: "",
      role: "",
      company: "",
      desc: "",
      sortOrder: experiences ? experiences.length : 0,
    });
    setIsDialogOpen(true);
  };

  const openEdit = (exp: any) => {
    setEditingId(exp.id);
    form.reset({
      year: exp.year,
      role: exp.role,
      company: exp.company,
      desc: exp.desc,
      sortOrder: exp.sortOrder,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: ExperienceFormValues) => {
    if (editingId) {
      updateExperience.mutate({ id: editingId, data }, {
        onSuccess: () => {
          toast({ title: "Experience updated" });
          queryClient.invalidateQueries({ queryKey: getListExperiencesQueryKey() });
          setIsDialogOpen(false);
        }
      });
    } else {
      createExperience.mutate({ data }, {
        onSuccess: () => {
          toast({ title: "Experience added" });
          queryClient.invalidateQueries({ queryKey: getListExperiencesQueryKey() });
          setIsDialogOpen(false);
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this experience?")) {
      deleteExperience.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Experience deleted" });
          queryClient.invalidateQueries({ queryKey: getListExperiencesQueryKey() });
        }
      });
    }
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-10 w-48" /><Skeleton className="h-64 w-full" /></div>;

  const sortedExp = [...(experiences || [])].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Experience</h1>
          <p className="text-muted-foreground mt-2">Manage your timeline of roles and achievements.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus size={16} className="mr-2" /> Add Role
        </Button>
      </div>

      <div className="space-y-4">
        {sortedExp.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground">No experiences added yet.</p>
          </div>
        ) : (
          sortedExp.map((exp) => (
            <div key={exp.id} className="bg-card border border-border rounded-xl p-6 flex items-start gap-6">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">{exp.year}</span>
                  <span className="text-sm text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">Order: {exp.sortOrder}</span>
                </div>
                <h3 className="text-xl font-display font-bold">{exp.role}</h3>
                <div className="text-sm font-medium text-muted-foreground">{exp.company}</div>
                <p className="text-sm text-muted-foreground pt-2">{exp.desc}</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => openEdit(exp)}>
                  <Edit2 size={14} className="mr-2" /> Edit
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(exp.id)}>
                  <Trash2 size={14} className="mr-2" /> Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Experience" : "Add Experience"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role / Title</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year Range</FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. 2021 — Present" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea rows={3} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort Order</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createExperience.isPending || updateExperience.isPending}>
                  {editingId ? "Save Changes" : "Add Role"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}