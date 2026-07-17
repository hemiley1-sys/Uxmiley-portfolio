import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useListTestimonials } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export function TestimonialsSection() {
  const { data: testimonialsData, isLoading } = useListTestimonials();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  if (isLoading) {
    return (
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 skew-y-3 transform origin-bottom-left" />
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <Skeleton className="h-12 w-80 mx-auto mb-4" />
          <div className="w-20 h-1 bg-primary rounded-full mx-auto mb-16" />
          <Skeleton className="h-48 w-full max-w-3xl mx-auto rounded-xl" />
        </div>
      </section>
    );
  }

  const testimonials = testimonialsData || [];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 skew-y-3 transform origin-bottom-left" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4">
            Words from Collaborators
          </h2>
          <div className="w-20 h-1 bg-primary rounded-full mx-auto" />
        </motion.div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id || index} className="flex-[0_0_100%] min-w-0 px-4 md:px-12">
                  <div className="flex flex-col items-center text-center">
                    <Quote className="w-12 h-12 text-primary/30 mb-8" />
                    <p className="text-xl md:text-3xl font-light text-foreground leading-relaxed mb-8 max-w-3xl">
                      "{testimonial.quote}"
                    </p>
                    <div>
                      <h4 className="font-display font-bold text-lg">{testimonial.name}</h4>
                      <p className="text-muted-foreground text-sm">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <button 
                onClick={() => emblaApi?.scrollPrev()}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-accent/10 hover:text-primary transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => emblaApi?.scrollTo(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      selectedIndex === idx ? "w-6 bg-primary" : "bg-border"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              <button 
                onClick={() => emblaApi?.scrollNext()}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-accent/10 hover:text-primary transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
