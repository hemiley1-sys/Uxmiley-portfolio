import { useListProjects, useCreateProject, useUpdateProject, useDeleteProject, getListProjectsQueryKey } from "@workspace/api-client-react";
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
import { Plus, Edit2, Trash2, ExternalLink } from "lucide-react";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  tech: z.string().min(1, "At least one technology is required"), // We'll parse this to string[]
  image: z.string().url("Must be a valid URL"),
  desc: z.string().min(1, "Description is required"),
  liveUrl: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function AdminProjects() {
  const { data: projects, isLoading } = useListProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      category: "",
      tech: "",
      image: "",
      desc: "",
      liveUrl: "",
      sortOrder: 0,
    },
  });

  const openAdd = () => {
    setEditingId(null);
    form.reset({
      title: "",
      category: "",
      tech: "",
      image: "",
      desc: "",
      liveUrl: "",
      sortOrder: projects ? projects.length : 0,
    });
    setIsDialogOpen(true);
  };

  const openEdit = (project: any) => {
    setEditingId(project.id);
    form.reset({
      title: project.title,
      category: project.category,
      tech: project.tech.join(", "),
      image: project.image,
      desc: project.desc,
      liveUrl: project.liveUrl || "",
      sortOrder: project.sortOrder,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: ProjectFormValues) => {
    const payload = {
      ...data,
      tech: data.tech.split(",").map(t => t.trim()).filter(Boolean),
      liveUrl: data.liveUrl || null
    };

    if (editingId) {
      updateProject.mutate({ id: editingId, data: payload }, {
        onSuccess: () => {
          toast({ title: "Project updated" });
          queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
          setIsDialogOpen(false);
        }
      });
    } else {
      createProject.mutate({ data: payload }, {
        onSuccess: () => {
          toast({ title: "Project created" });
          queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
          setIsDialogOpen(false);
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Project deleted" });
          queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        }
      });
    }
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-10 w-48" /><Skeleton className="h-64 w-full" /></div>;

  const sortedProjects = [...(projects || [])].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Projects</h1>
          <p className="text-muted-foreground mt-2">Manage your portfolio case studies and projects.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus size={16} className="mr-2" /> Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedProjects.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground">No projects added yet.</p>
          </div>
        ) : (
          sortedProjects.map((project) => (
            <div key={project.id} className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
              <div 
                className="h-48 bg-muted bg-cover bg-center" 
                style={{ backgroundImage: `url(${project.image})` }}
              />
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">{project.category}</span>
                    <h3 className="text-xl font-bold mt-1 line-clamp-1">{project.title}</h3>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(project)}>
                      <Edit2 size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(project.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                  {project.desc}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <div className="flex gap-1 text-xs text-muted-foreground">
                    Order: {project.sortOrder}
                  </div>
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center hover:underline">
                      View Live <ExternalLink size={12} className="ml-1" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Project" : "Add Project"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. Web Development" /></FormControl>
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
              </div>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl><Input {...field} placeholder="https://..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tech"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technologies (comma separated)</FormLabel>
                    <FormControl><Input {...field} placeholder="React, TypeScript, Tailwind" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                name="liveUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Live URL (optional)</FormLabel>
                    <FormControl><Input {...field} placeholder="https://..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createProject.isPending || updateProject.isPending}>
                  {editingId ? "Save Changes" : "Create Project"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}