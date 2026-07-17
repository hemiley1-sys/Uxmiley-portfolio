import { useListSkills, useCreateSkill, useUpdateSkill, useDeleteSkill, getListSkillsQueryKey } from "@workspace/api-client-react";
import { useListServices, useCreateService, useUpdateService, useDeleteService, getListServicesQueryKey } from "@workspace/api-client-react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit2, Trash2 } from "lucide-react";

const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  sortOrder: z.coerce.number().default(0),
});

const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  desc: z.string().min(1, "Description is required"),
  sortOrder: z.coerce.number().default(0),
});

export default function AdminSkills() {
  const { data: skills, isLoading: skillsLoading } = useListSkills();
  const { data: services, isLoading: servicesLoading } = useListServices();
  
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();
  
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("skills");
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const skillForm = useForm<z.infer<typeof skillSchema>>({
    resolver: zodResolver(skillSchema),
    defaultValues: { name: "", category: "Frontend", sortOrder: 0 },
  });

  const serviceForm = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { title: "", desc: "", sortOrder: 0 },
  });

  // Skills Handlers
  const openAddSkill = () => {
    setEditingId(null);
    skillForm.reset({ name: "", category: "Frontend", sortOrder: skills ? skills.length : 0 });
    setIsSkillDialogOpen(true);
  };

  const openEditSkill = (skill: any) => {
    setEditingId(skill.id);
    skillForm.reset({ name: skill.name, category: skill.category, sortOrder: skill.sortOrder });
    setIsSkillDialogOpen(true);
  };

  const onSkillSubmit = (data: z.infer<typeof skillSchema>) => {
    if (editingId) {
      updateSkill.mutate({ id: editingId, data }, {
        onSuccess: () => {
          toast({ title: "Skill updated" });
          queryClient.invalidateQueries({ queryKey: getListSkillsQueryKey() });
          setIsSkillDialogOpen(false);
        }
      });
    } else {
      createSkill.mutate({ data }, {
        onSuccess: () => {
          toast({ title: "Skill created" });
          queryClient.invalidateQueries({ queryKey: getListSkillsQueryKey() });
          setIsSkillDialogOpen(false);
        }
      });
    }
  };

  const handleDeleteSkill = (id: number) => {
    if (confirm("Delete this skill?")) {
      deleteSkill.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Skill deleted" });
          queryClient.invalidateQueries({ queryKey: getListSkillsQueryKey() });
        }
      });
    }
  };

  // Services Handlers
  const openAddService = () => {
    setEditingId(null);
    serviceForm.reset({ title: "", desc: "", sortOrder: services ? services.length : 0 });
    setIsServiceDialogOpen(true);
  };

  const openEditService = (service: any) => {
    setEditingId(service.id);
    serviceForm.reset({ title: service.title, desc: service.desc, sortOrder: service.sortOrder });
    setIsServiceDialogOpen(true);
  };

  const onServiceSubmit = (data: z.infer<typeof serviceSchema>) => {
    if (editingId) {
      updateService.mutate({ id: editingId, data }, {
        onSuccess: () => {
          toast({ title: "Service updated" });
          queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() });
          setIsServiceDialogOpen(false);
        }
      });
    } else {
      createService.mutate({ data }, {
        onSuccess: () => {
          toast({ title: "Service created" });
          queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() });
          setIsServiceDialogOpen(false);
        }
      });
    }
  };

  const handleDeleteService = (id: number) => {
    if (confirm("Delete this service?")) {
      deleteService.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Service deleted" });
          queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() });
        }
      });
    }
  };

  if (skillsLoading || servicesLoading) return <div className="space-y-4"><Skeleton className="h-10 w-48" /><Skeleton className="h-64 w-full" /></div>;

  const sortedSkills = [...(skills || [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const sortedServices = [...(services || [])].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Skills & Services</h1>
        <p className="text-muted-foreground mt-2">Manage your technical arsenal and professional offerings.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 border-b border-border w-full justify-start rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger value="skills" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">
            Tech Stack
          </TabsTrigger>
          <TabsTrigger value="services" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">
            Services
          </TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openAddSkill}><Plus size={16} className="mr-2" /> Add Skill</Button>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="w-[100px]">Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSkills.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8">No skills found.</TableCell></TableRow>
                ) : (
                  sortedSkills.map(skill => (
                    <TableRow key={skill.id}>
                      <TableCell className="font-medium">{skill.name}</TableCell>
                      <TableCell>{skill.category}</TableCell>
                      <TableCell>{skill.sortOrder}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEditSkill(skill)}><Edit2 size={16} /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteSkill(skill.id)}><Trash2 size={16} /></Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openAddService}><Plus size={16} className="mr-2" /> Add Service</Button>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedServices.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8">No services found.</TableCell></TableRow>
                ) : (
                  sortedServices.map(service => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium whitespace-nowrap">{service.title}</TableCell>
                      <TableCell className="max-w-[400px] truncate">{service.desc}</TableCell>
                      <TableCell>{service.sortOrder}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button variant="ghost" size="icon" onClick={() => openEditService(service)}><Edit2 size={16} /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteService(service.id)}><Trash2 size={16} /></Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Skill Dialog */}
      <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? "Edit Skill" : "Add Skill"}</DialogTitle></DialogHeader>
          <Form {...skillForm}>
            <form onSubmit={skillForm.handleSubmit(onSkillSubmit)} className="space-y-4 pt-4">
              <FormField control={skillForm.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Skill Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={skillForm.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Frontend">Frontend</SelectItem>
                      <SelectItem value="Backend">Backend</SelectItem>
                      <SelectItem value="CMS">CMS</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={skillForm.control} name="sortOrder" render={({ field }) => (
                <FormItem><FormLabel>Sort Order</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsSkillDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingId ? "Save Changes" : "Add Skill"}</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Service Dialog */}
      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? "Edit Service" : "Add Service"}</DialogTitle></DialogHeader>
          <Form {...serviceForm}>
            <form onSubmit={serviceForm.handleSubmit(onServiceSubmit)} className="space-y-4 pt-4">
              <FormField control={serviceForm.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Service Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={serviceForm.control} name="desc" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={serviceForm.control} name="sortOrder" render={({ field }) => (
                <FormItem><FormLabel>Sort Order</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsServiceDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingId ? "Save Changes" : "Add Service"}</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}