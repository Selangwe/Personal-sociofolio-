'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  User,
  Briefcase,
  FolderKanban,
  Sparkles,
  Star,
  Mail,
  Calendar,
} from 'lucide-react';
import { navItems } from '@/lib/data';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  User,
  Briefcase,
  FolderKanban,
  Sparkles,
  Star,
  Mail,
};

export function MobileNav() {
  const [activeSection, setActiveSection] = useState('home');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
      const sections = navItems.map((item) => item.href);
      const current = sections.find((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 150 && rect.bottom >= 150;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const el = document.getElementById(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const mobileItems = navItems.slice(0, 5);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.a
            href="https://calendly.com/selangwe19u/30min"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 md:hidden"
            aria-label="Book a call"
          >
            <Calendar className="h-6 w-6" />
          </motion.a>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border glass md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileItems.map((item) => {
            const Icon = iconMap[item.icon] || Home;
            const isActive = activeSection === item.href;
            return (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className={cn(
                  'flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-xs font-medium transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground',
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
