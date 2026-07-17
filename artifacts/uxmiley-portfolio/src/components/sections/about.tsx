import { motion } from "framer-motion";
import { useGetAbout } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export function AboutSection() {
  const { data: about, isLoading } = useGetAbout();

  if (isLoading) {
    return (
      <section id="about" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:mb-24">
            <Skeleton className="h-12 w-96 mb-4" />
            <div className="w-20 h-1 bg-primary rounded-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-6">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((idx) => (
                <Skeleton key={idx} className="h-40 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!about) return null;

  const stats = about.stats || [
    { value: "7+", label: "Years Experience" },
    { value: "50+", label: "Projects Completed" },
    { value: "15+", label: "Awards Won" },
    { value: "99%", label: "Client Satisfaction" },
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-24"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4">
            The architect behind the pixels.
          </h2>
          <div className="w-20 h-1 bg-primary rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 text-lg text-muted-foreground font-light leading-relaxed"
          >
            <p>{about.bio1}</p>
            {about.bio2 && <p>{about.bio2}</p>}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="glass-panel p-8 rounded-2xl flex flex-col items-start justify-center transition-transform hover:-translate-y-1">
                  <span className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/50 mb-2">
                    {stat.value}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
