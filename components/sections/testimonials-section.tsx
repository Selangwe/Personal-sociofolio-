'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials } from '@/lib/data';
import { SectionHeading } from '@/components/ui/section-heading';
import { cn } from '@/lib/utils';

export function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    const interval = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => {
      clearInterval(interval);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <section id="testimonials" aria-label="Client testimonials" className="scroll-mt-32 py-12">
      <SectionHeading
        title="Testimonials"
        subtitle="What clients say about working with me."
      />

      <div className="relative">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="min-w-0 flex-[0_0_100%] pl-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="h-full rounded-xl border border-border bg-card p-6 shadow-sm"
                >
                  <Quote className="h-8 w-8 text-primary/20" aria-hidden="true" />
                  <div className="mt-2 flex gap-0.5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="mt-3 flex-1 text-sm text-muted-foreground">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role} · {testimonial.company}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full border border-border bg-card p-2 text-foreground shadow-sm transition-colors hover:border-primary hover:text-primary"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full border border-border bg-card p-2 text-foreground shadow-sm transition-colors hover:border-primary hover:text-primary"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="mt-4 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                'h-2 rounded-full transition-all',
                selectedIndex === i
                  ? 'w-6 bg-primary'
                  : 'w-2 bg-border hover:bg-muted-foreground',
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
