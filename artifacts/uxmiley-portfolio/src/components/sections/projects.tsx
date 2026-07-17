import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useListProjects } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectsSection() {
  const { data: projectsData, isLoading } = useListProjects();
  const [activeFilter, setActiveFilter] = useState("All");

  const projects = projectsData || [];
  
  const categories = useMemo(() => {
    const cats = new Set(projects.map(p => p.category));
    return ["All", ...Array.from(cats)];
  }, [projects]);

  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  if (isLoading) {
    return (
      <section id="projects" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <Skeleton className="h-12 w-64 mb-4" />
              <div className="w-20 h-1 bg-primary rounded-full" />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-24 rounded-full" />)}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4">
              Selected Works
            </h2>
            <div className="w-20 h-1 bg-primary rounded-full" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === cat 
                    ? "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(139,92,246,0.3)]" 
                    : "bg-secondary/5 text-muted-foreground hover:bg-secondary/10 hover:text-foreground border border-border/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative overflow-hidden rounded-2xl bg-card border border-border aspect-[4/3] cursor-pointer"
                onClick={() => project.liveUrl && window.open(project.liveUrl, '_blank')}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${project.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80" />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex flex-col justify-end p-8">
                  <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs font-medium tracking-wider text-primary uppercase mb-2 block">
                          {project.category}
                        </span>
                        <h3 className="text-2xl font-display font-bold text-foreground">
                          {project.title}
                        </h3>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground transform -rotate-45 group-hover:rotate-0 transition-transform duration-500 delay-100">
                        <ArrowUpRight size={24} />
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm font-light mb-6 line-clamp-2">
                      {project.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span key={t} className="px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground text-xs font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
