'use client';

import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, MapPin, CheckCircle2 } from 'lucide-react';
import { experiences, education, skills } from '@/lib/data';
import { SectionHeading } from '@/components/ui/section-heading';
import { SkillBadge } from '@/components/ui/skill-badge';

export function ExperienceSection() {
  return (
    <section id="experience" aria-label="Work experience" className="scroll-mt-32 py-12">
      <SectionHeading
        title="Experience & Education"
        subtitle="My professional journey and academic background."
      />

      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -2 }}
            className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-foreground">
                    {exp.role}
                  </h3>
                  {exp.current && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-primary">
                  {exp.company}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>{exp.type}</span>
                  <span>·</span>
                  <span>
                    {exp.startDate} - {exp.endDate}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {exp.location}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {exp.description}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {exp.responsibilities.map((resp, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {resp}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-2">
                  {exp.skills.map((skill) => (
                    <SkillBadge key={skill} name={skill} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <GraduationCap className="h-5 w-5 text-primary" />
          Education
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {edu.school}
                  </h4>
                  <p className="text-sm text-primary">{edu.degree}</p>
                  <p className="text-xs text-muted-foreground">{edu.field}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {edu.startDate} - {edu.endDate}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {edu.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          All Skills
        </h3>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <SkillBadge
                key={skill.name}
                name={skill.name}
                level={skill.level}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
