import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetHero } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export function HeroSection() {
  const { data: hero, isLoading } = useGetHero();

  if (isLoading) {
    return (
      <section id="home" className="relative min-h-[100dvh] flex items-center justify-center pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-start text-left w-full space-y-6">
              <Skeleton className="h-8 w-64 rounded-full" />
              <Skeleton className="h-24 w-full md:h-48" />
              <Skeleton className="h-20 w-full max-w-lg" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-48" />
              </div>
            </div>
            <div className="hidden lg:block w-full">
              <Skeleton className="h-[600px] w-full rounded-3xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!hero) return null;

  return (
    <section id="home" className="relative min-h-[100dvh] flex items-center justify-center pt-20 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50 dark:opacity-30" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary/20 rounded-full blur-[120px] pointer-events-none opacity-50 dark:opacity-30" />
      
      {/* Noise overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium tracking-wide">{hero.availabilityStatus || "Available for new opportunities"}</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.05] tracking-tight mb-6"
            >
              {hero.tagline ? (
                hero.tagline.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))
              ) : (
                <>
                  Designing <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-300% animate-gradient">
                    experiences
                  </span> <br />
                  that feel <br className="hidden md:block" />
                  inevitable.
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground max-w-lg mb-10 font-light leading-relaxed"
            >
              I am <strong className="text-foreground font-semibold">{hero.name}</strong>. A {hero.role} based in {hero.location}, crafting digital products at the intersection of beauty and logic.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Button size="lg" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
                {hero.ctaLabel || "View Work"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              {hero.resumeUrl && (
                <Button variant="outline" size="lg" asChild>
                  <a href={hero.resumeUrl} target="_blank" rel="noopener noreferrer">
                    Download Résumé <Download className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative hidden lg:block h-[600px] w-full"
          >
            {/* Abstract visual representation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[400px] h-[500px]">
                <div className="absolute inset-0 glass-panel rounded-3xl border border-white/20 transform rotate-[-6deg] z-10 overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
                  <div className="p-8 flex flex-col h-full justify-between opacity-80">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-md" />
                      <div className="w-3/4 h-4 rounded bg-border/50" />
                      <div className="w-1/2 h-4 rounded bg-border/50" />
                    </div>
                    <div className="space-y-4">
                      <div className="w-full h-24 rounded-xl bg-secondary/10 backdrop-blur-md" />
                      <div className="flex gap-4">
                        <div className="w-1/2 h-10 rounded-lg bg-primary/20" />
                        <div className="w-1/2 h-10 rounded-lg bg-border/50" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-secondary/20 rounded-3xl transform rotate-[3deg] z-0 blur-sm" />
                <div className="absolute inset-0 border border-primary/30 rounded-3xl transform rotate-[8deg] z-0" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"
        />
      </motion.div>
    </section>
  );
}
