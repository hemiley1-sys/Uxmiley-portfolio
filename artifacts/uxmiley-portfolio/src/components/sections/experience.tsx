import { motion } from "framer-motion";
import { useListExperiences } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export function ExperienceSection() {
  const { data: experiencesData, isLoading } = useListExperiences();

  if (isLoading) {
    return (
      <section id="experience" className="py-24 relative bg-accent/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-16 md:mb-24 text-center">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <div className="w-20 h-1 bg-secondary rounded-full mx-auto" />
          </div>
          <div className="space-y-12">
            {[1, 2, 3].map((idx) => (
              <Skeleton key={idx} className="h-40 w-full md:w-[45%] rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const experiences = experiencesData || [];

  return (
    <section id="experience" className="py-24 relative bg-accent/5">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-24 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4">
            The Journey
          </h2>
          <div className="w-20 h-1 bg-secondary rounded-full mx-auto" />
        </motion.div>

        <div className="relative border-l border-border/50 ml-4 md:ml-0 md:border-none space-y-12">
          {/* Vertical line for desktop */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-border/50 transform -translate-x-1/2" />

          {experiences.map((exp, idx) => (
            <motion.div 
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative flex flex-col md:flex-row items-start md:items-center justify-between w-full ${
                idx % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-[-5px] md:left-1/2 md:-translate-x-1/2 w-3 h-3 rounded-full bg-background border-2 border-primary z-10 top-2 md:top-auto" />

              {/* Content Box */}
              <div className={`w-full md:w-[45%] pl-6 md:pl-0 ${
                idx % 2 === 0 ? "md:pl-12" : "md:pr-12 text-left md:text-right"
              }`}>
                <div className="glass-panel p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
                  <span className="text-sm font-medium text-primary tracking-wider uppercase block mb-2">
                    {exp.year}
                  </span>
                  <h3 className="text-xl font-display font-bold text-foreground mb-1">
                    {exp.role}
                  </h3>
                  <span className="text-muted-foreground font-medium text-sm block mb-4">
                    {exp.company}
                  </span>
                  <p className="text-muted-foreground text-sm font-light leading-relaxed">
                    {exp.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
