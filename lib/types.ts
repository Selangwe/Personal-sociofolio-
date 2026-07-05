export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export interface Profile {
  name: string;
  title: string;
  headline: string;
  bio: string;
  location: string;
  email: string;
  website: string;
  calendly: string;
  resumeUrl: string;
  avatar: string;
  cover: string;
  verified: boolean;
  followers: string;
  connections: string;
  availability: string;
  languages: string[];
  socials: SocialLink[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  type: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  current: boolean;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  name: string;
  level: number;
  category: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
  color: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  cover: string;
  category: string;
  techStack: string[];
  results: { label: string; value: string }[];
  link?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  quote: string;
}

export interface Post {
  id: string;
  type: 'text' | 'image' | 'video' | 'carousel' | 'youtube' | 'case-study';
  timestamp: string;
  title?: string;
  content: string;
  image?: string;
  images?: string[];
  youtubeId?: string;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  category: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  icon: string;
  link: string;
  downloads?: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface Stat {
  label: string;
  value: number;
  suffix: string;
}

export interface CoreValue {
  title: string;
  description: string;
  icon: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}
