import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useListArticles } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export function ArticlesSection() {
  const { data: articlesData, isLoading } = useListArticles();

  if (isLoading) {
    return (
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <Skeleton className="h-12 w-64 mb-4" />
              <div className="w-20 h-1 bg-secondary rounded-full" />
            </div>
            <Skeleton className="h-8 w-80 max-w-md" />
          </div>
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
          </div>
        </div>
      </section>
    );
  }

  const articles = articlesData || [];

  return (
    <section className="py-24 relative">
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
              Thoughts & Musings
            </h2>
            <div className="w-20 h-1 bg-secondary rounded-full" />
          </div>
          <p className="text-muted-foreground max-w-md font-light text-lg">
            Writing about the intersection of design, engineering, and human psychology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6">
          {articles.map((article, idx) => (
            <motion.a
              key={article.id || idx}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group glass-panel p-6 md:p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/5 dark:hover:bg-white/5 transition-colors border border-border/50 hover:border-primary/50 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              
              <div className="flex-1 z-10">
                <div className="flex flex-wrap gap-4 items-center mb-3">
                  <span className="text-xs font-medium text-primary tracking-wider uppercase">
                    {article.category}
                  </span>
                  <span className="text-muted-foreground text-xs">{article.date}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-display font-bold text-foreground group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
              </div>
              
              <div className="flex items-center gap-4 z-10">
                <span className="text-sm text-muted-foreground font-medium">{article.readTime}</span>
                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
