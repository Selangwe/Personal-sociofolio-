'use client';

import { motion } from 'framer-motion';
import {
  MapPin,
  Mail,
  Globe,
  GraduationCap,
  Briefcase,
  Download,
  Calendar,
  Clock,
  Languages,
  Linkedin,
} from 'lucide-react';
import { profile, education, experiences, skills } from '@/lib/data';
import { RippleButton } from '@/components/ui/ripple-button';
import { SkillBadge } from '@/components/ui/skill-badge';

export function ProfileSidebar() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="sticky top-32 hidden h-fit space-y-4 lg:block"
    >
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="h-14 w-14 rounded-full border-2 border-primary object-cover"
          />
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {profile.name}
            </h3>
            <p className="text-xs text-muted-foreground">{profile.title}</p>
          </div>
        </div>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span>{profile.location}</span>
          </div>
          <a
            href={`mailto:${profile.email}`}
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          >
            <Mail className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{profile.email}</span>
          </a>
          <a
            href={profile.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          >
            <Globe className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">Personal Website</span>
          </a>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0 text-primary" />
            <span>{profile.availability}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Languages className="h-4 w-4 shrink-0 text-primary" />
            <span>{profile.languages.join(' & ')}</span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <RippleButton
            href={profile.calendly}
            size="sm"
            className="flex-1"
          >
            <Calendar className="h-4 w-4" />
            Book a Call
          </RippleButton>
          <RippleButton
            href={profile.resumeUrl}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4" />
          </RippleButton>
        </div>

        <a
          href={profile.socials[1].href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Linkedin className="h-4 w-4" />
          Connect on LinkedIn
        </a>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Briefcase className="h-4 w-4 text-primary" />
          Experience
        </h4>
        <div className="mt-3 space-y-3">
          {experiences.slice(0, 2).map((exp) => (
            <div key={exp.id} className="border-l-2 border-border pl-3">
              <p className="text-xs font-semibold text-foreground">{exp.role}</p>
              <p className="text-xs text-muted-foreground">{exp.company}</p>
              <p className="text-xs text-muted-foreground">
                {exp.startDate} - {exp.endDate}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <GraduationCap className="h-4 w-4 text-primary" />
          Education
        </h4>
        <div className="mt-3 space-y-3">
          {education.map((edu) => (
            <div key={edu.id} className="border-l-2 border-border pl-3">
              <p className="text-xs font-semibold text-foreground">{edu.school}</p>
              <p className="text-xs text-muted-foreground">{edu.degree}</p>
              <p className="text-xs text-muted-foreground">
                {edu.startDate} - {edu.endDate}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h4 className="text-sm font-semibold text-foreground">Skills</h4>
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.slice(0, 8).map((skill) => (
            <SkillBadge key={skill.name} name={skill.name} />
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
