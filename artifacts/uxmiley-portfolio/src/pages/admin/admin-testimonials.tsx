import { useListTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial, getListTestimonialsQueryKey } from "@workspace/api-client-react";
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
import { Plus, Edit2, Trash2, Quote } from "lucide-react";

const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title/Company is required"),
  quote: z.string().min(1, "Quote is required"),
  sortOrder: z.coerce.number().default(0),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export default function AdminTestimonials() {
  const { data: testimonials, isLoading } = useListTestimonials();
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: "",
      title: "",
      quote: "",
      sortOrder: 0,
    },
  });

  const openAdd = () => {
    setEditingId(null);
    form.reset({
      name: "",
      title: "",
      quote: "",
      sortOrder: testimonials ? testimonials.length : 0,
    });
    setIsDialogOpen(true);
  };

  const openEdit = (t: any) => {
    setEditingId(t.id);
    form.reset({
      name: t.name,
      title: t.title,
      quote: t.quote,
      sortOrder: t.sortOrder,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: TestimonialFormValues) => {
    if (editingId) {
      updateTestimonial.mutate({ id: editingId, data }, {
        onSuccess: () => {
          toast({ title: "Testimonial updated" });
          queryClient.invalidateQueries({ queryKey: getListTestimonialsQueryKey() });
          setIsDialogOpen(false);
        }
      });
    } else {
      createTestimonial.mutate({ data }, {
        onSuccess: () => {
          toast({ title: "Testimonial added" });
          queryClient.invalidateQueries({ queryKey: getListTestimonialsQueryKey() });
          setIsDialogOpen(false);
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      deleteTestimonial.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Testimonial deleted" });
          queryClient.invalidateQueries({ queryKey: getListTestimonialsQueryKey() });
        }
      });
    }
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-10 w-48" /><Skeleton className="h-64 w-full" /></div>;

  const sortedTestimonials = [...(testimonials || [])].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Testimonials</h1>
          <p className="text-muted-foreground mt-2">Manage what clients and collaborators say about you.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus size={16} className="mr-2" /> Add Testimonial
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sortedTestimonials.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground">No testimonials added yet.</p>
          </div>
        ) : (
          sortedTestimonials.map((t) => (
            <div key={t.id} className="bg-card border border-border rounded-xl p-6 relative">
              <div className="absolute top-6 right-6 flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(t)}>
                  <Edit2 size={16} />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(t.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              <p className="text-lg italic text-foreground mb-6 pr-16">"{t.quote}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold font-display">{t.name}</h4>
                  <p className="text-sm text-muted-foreground">{t.title}</p>
                </div>
                <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                  Order: {t.sortOrder}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="quote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quote</FormLabel>
                    <FormControl><Textarea rows={4} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title / Company</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                <Button type="submit" disabled={createTestimonial.isPending || updateTestimonial.isPending}>
                  {editingId ? "Save Changes" : "Add Testimonial"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}