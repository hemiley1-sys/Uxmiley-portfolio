import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { 
  SiFigma, SiReact, SiNextdotjs, 
  SiTypescript, SiTailwindcss, SiFramer, SiNodedotjs, 
  SiPostgresql, SiWordpress 
} from "react-icons/si";
import { useListSkills, useListServices } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

// Map names to icons (fallback to Layers if not found)
const iconMap: Record<string, any> = {
  "Figma": SiFigma,
  "Adobe XD": Layers,
  "React": SiReact,
  "Next.js": SiNextdotjs,
  "TypeScript": SiTypescript,
  "Tailwind CSS": SiTailwindcss,
  "Framer Motion": SiFramer,
  "Node.js": SiNodedotjs,
  "PostgreSQL": SiPostgresql,
  "WordPress": SiWordpress,
};

export function SkillsSection() {
  const { data: skillsData, isLoading: isLoadingSkills } = useListSkills();
  const { data: servicesData, isLoading: isLoadingServices } = useListServices();

  const isLoading = isLoadingSkills || isLoadingServices;

  if (isLoading) {
    return (
      <section id="skills" className="py-24 relative bg-accent/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <Skeleton className="h-12 w-64 mb-4" />
              <div className="w-20 h-1 bg-secondary rounded-full" />
            </div>
            <Skeleton className="h-16 w-full max-w-md" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5 space-y-8">
              <Skeleton className="h-8 w-32 mb-8" />
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full" />)}
            </div>
            <div className="lg:col-span-7">
              <Skeleton className="h-8 w-32 mb-8" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const skills = skillsData || [];
  const services = servicesData || [];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section id="skills" className="py-24 relative bg-accent/5">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4">
              Arsenal & Expertise
            </h2>
            <div className="w-20 h-1 bg-secondary rounded-full" />
          </div>
          <p className="text-muted-foreground max-w-md font-light text-lg">
            A carefully curated stack of tools allowing me to seamlessly transition from concept to deployment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <h3 className="text-xl font-display font-semibold mb-8 text-foreground">Services</h3>
            <div className="space-y-8">
              {services.map((service, idx) => (
                <motion.div 
                  key={service.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative pl-6 border-l-2 border-border hover:border-primary transition-colors"
                >
                  <div className="absolute w-3 h-3 bg-background border-2 border-primary rounded-full -left-[7px] top-1.5" />
                  <h4 className="text-lg font-medium text-foreground mb-2">{service.title}</h4>
                  <p className="text-muted-foreground text-sm font-light leading-relaxed">{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <h3 className="text-xl font-display font-semibold mb-8 text-foreground">Tech Stack</h3>
            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              {skills.map((skill, idx) => {
                const Icon = iconMap[skill.name] || Layers;
                return (
                  <motion.div 
                    key={skill.id} 
                    variants={item}
                    className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center gap-4 hover:bg-white/5 dark:hover:bg-white/5 transition-all group"
                  >
                    <Icon className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    <span className="text-sm font-medium text-foreground">{skill.name}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
