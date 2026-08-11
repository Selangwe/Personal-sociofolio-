import type {
  Profile,
  Experience,
  Education,
  Skill,
  Service,
  Project,
  Testimonial,
  Post,
  Resource,
  TimelineEvent,
  Stat,
  CoreValue,
  NavItem,
} from '../types';

export const profile: Profile = {
  name: 'Samme Samuel',
  title: 'GHL Expert | AI Engineer | Data Analyst | Virtual Assistant',
  headline:
    'Helping businesses automate operations, generate leads, and scale with AI, GoHighLevel, and smart systems.',
  bio: 'I am a results-driven AI Engineer, GoHighLevel Expert, and Virtual Assistant with a passion for building automation systems that save time and generate revenue. With hands-on experience in AI automation, CRM setup, cold email systems, and web development, I help entrepreneurs and agencies streamline operations and focus on growth.',
  location: 'Yaounde, Centre, Cameroon',
  email: 'selangwe19u@gmail.com',
  website: 'https://samme-samuel.coreflareagency.com/',
  calendly: 'https://calendly.com/selangwe19u/30min',
  resumeUrl: '/resume.pdf',
  avatar: '/images/Generated_Image_November_05,_2025_-_6_20AM copy.png',
  cover:
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&h=500&fit=crop',
  verified: true,
  followers: '2.4K',
  connections: '500+',
  availability: 'Mon-Fri (8am-10:30pm UTC)',
  languages: ['English', 'French'],
  socials: [
    {
      label: 'TikTok',
      href: 'https://www.tiktok.com/@automatewithsam?is_from_webapp=1&sender_device=pc',
      icon: 'tiktok',
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/samme-samuel-975a8b305',
      icon: 'linkedin',
    },
  ],
};

export const navItems: NavItem[] = [
  { label: 'Home', href: 'home', icon: 'Home' },
  { label: 'About', href: 'about', icon: 'User' },
  { label: 'Experience', href: 'experience', icon: 'Briefcase' },
  { label: 'Projects', href: 'projects', icon: 'FolderKanban' },
  { label: 'Services', href: 'services', icon: 'Sparkles' },
  { label: 'Testimonials', href: 'testimonials', icon: 'Star' },
  { label: 'Resources', href: 'resources', icon: 'Download' },
  { label: 'Contact', href: 'contact', icon: 'Mail' },
];

export const experiences: Experience[] = [
  {
    id: 'exp-1',
    role: 'Virtual Assistant',
    company: 'VMedia',
    type: 'Full-time',
    startDate: 'Sep 2023',
    endDate: 'Present',
    location: 'Remote',
    description:
      'Managing daily operations, client communications, and automation workflows for a digital media company.',
    responsibilities: [
      'Built and maintained automated workflows using Zapier and Make.com',
      'Managed CRM pipelines and lead nurturing sequences in GoHighLevel',
      'Handled client onboarding, scheduling, and email management',
      'Created data dashboards and reports to track KPIs',
    ],
    skills: ['GoHighLevel', 'Zapier', 'Make.com', 'CRM', 'Data Analysis'],
    current: true,
  },
  {
    id: 'exp-2',
    role: 'Virtual Assistant',
    company: 'VMedia',
    type: 'Contract',
    startDate: 'Mar 2023',
    endDate: 'Aug 2023',
    location: 'Remote',
    description:
      'Provided administrative and technical support to the VMedia team during a period of rapid growth.',
    responsibilities: [
      'Managed inbox and calendar for senior team members',
      'Conducted market research and compiled competitor analysis reports',
      'Assisted with social media scheduling and content publishing',
    ],
    skills: ['Admin Support', 'Research', 'Social Media'],
    current: false,
  },
  {
    id: 'exp-3',
    role: 'Penetration Tester',
    company: 'Creative relay',
    type: 'Internship',
    startDate: '2022',
    endDate: '2022',
    location: 'Cameroon',
    description:
      'Completed a cybersecurity internship focused on penetration testing and vulnerability assessment.',
    responsibilities: [
      'Performed vulnerability scans on client web applications',
      'Documented findings and recommended remediation steps',
      'Assisted the security team with penetration testing engagements',
    ],
    skills: ['Cybersecurity', 'Penetration Testing', 'Reporting'],
    current: false,
  },
];

export const education: Education[] = [
  {
    id: 'edu-1',
    school: 'Landmark Metropolitan University',
    degree: 'Bachelor of Science',
    field: 'Software Engineering',
    startDate: '2021',
    endDate: '2025',
    description:
      'Comprehensive software engineering program covering algorithms, web development, databases, and AI fundamentals.',
  },
  {
    id: 'edu-2',
    school: 'Catholic University Institute of Buea',
    degree: 'Higher National Diploma (HND)',
    field: 'Software Engineering',
    startDate: '2019',
    endDate: '2021',
    description:
      'Foundation in software development, programming principles, and computer systems.',
  },
];

export const skills: Skill[] = [
  { name: 'GoHighLevel (GHL)', level: 95, category: 'Automation' },
  { name: 'AI Automation', level: 90, category: 'Automation' },
  { name: 'Zapier', level: 88, category: 'Automation' },
  { name: 'Make.com', level: 85, category: 'Automation' },
  { name: 'Cold Email Systems', level: 87, category: 'Marketing' },
  { name: 'Lead Generation', level: 85, category: 'Marketing' },
  { name: 'SEO', level: 80, category: 'Marketing' },
  { name: 'CRM Setup', level: 90, category: 'Operations' },
  { name: 'Data Analysis', level: 82, category: 'Analytics' },
  { name: 'Web Development', level: 84, category: 'Development' },
  { name: 'Virtual Assistance', level: 92, category: 'Operations' },
  { name: 'Marketing Automation', level: 88, category: 'Marketing' },
];

export const services: Service[] = [
  {
    id: 'srv-1',
    title: 'AI Automation',
    description:
      'Build custom AI-powered workflows that automate repetitive tasks, handle customer inquiries, and streamline your business operations 24/7.',
    icon: 'Bot',
    benefits: ['Save 20+ hours/week', 'Reduce human error', 'Scale without hiring'],
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'srv-2',
    title: 'Website Development',
    description:
      'Fast, responsive, SEO-optimized websites built with modern frameworks that convert visitors into customers.',
    icon: 'Code',
    benefits: ['Lightning-fast load times', 'Mobile-first design', 'SEO ready'],
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'srv-3',
    title: 'GoHighLevel',
    description:
      'Full GoHighLevel setup including funnels, pipelines, automations, calendars, and reputation management to run your agency on autopilot.',
    icon: 'Rocket',
    benefits: ['Done-for-you setup', 'Custom automations', 'Pipeline optimization'],
    color: 'from-indigo-500 to-blue-600',
  },
  {
    id: 'srv-4',
    title: 'SEO',
    description:
      'Technical and on-page SEO optimization to help your website rank higher on Google and attract organic traffic.',
    icon: 'Search',
    benefits: ['Higher Google rankings', 'More organic traffic', 'Keyword strategy'],
    color: 'from-teal-500 to-cyan-500',
  },
  {
    id: 'srv-5',
    title: 'Cold Email Systems',
    description:
      'Set up and manage cold email infrastructure with warmed domains, deliverability best practices, and conversion-focused copy.',
    icon: 'Mail',
    benefits: ['Higher open rates', 'Domain warming', 'Reply tracking'],
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'srv-6',
    title: 'CRM Setup',
    description:
      'Configure and optimize your CRM to track every lead, automate follow-ups, and never let a deal slip through the cracks.',
    icon: 'Database',
    benefits: ['Lead tracking', 'Automated follow-ups', 'Pipeline visibility'],
    color: 'from-sky-500 to-blue-500',
  },
  {
    id: 'srv-7',
    title: 'Virtual Assistance',
    description:
      'Reliable virtual support for inbox management, scheduling, research, data entry, and day-to-day operations.',
    icon: 'Headset',
    benefits: ['Inbox zero', 'Calendar management', 'Research & reports'],
    color: 'from-blue-500 to-teal-500',
  },
  {
    id: 'srv-8',
    title: 'Lead Generation',
    description:
      'Multi-channel lead generation systems combining cold email, social media, and automation to fill your pipeline.',
    icon: 'Target',
    benefits: ['Qualified leads', 'Multi-channel outreach', 'Automated nurturing'],
    color: 'from-cyan-600 to-blue-600',
  },
  {
    id: 'srv-9',
    title: 'Marketing Automation',
    description:
      'End-to-end marketing automation workflows that nurture leads from first touch to closed deal without manual effort.',
    icon: 'Workflow',
    benefits: ['Email sequences', 'Lead scoring', 'Behavior triggers'],
    color: 'from-indigo-500 to-cyan-500',
  },
];

export const projects: Project[] = [
  {
    id: 'proj-1',
    title: 'AI Customer Support Chatbot',
    description:
      'Built a custom AI chatbot for an e-commerce brand that handles 80% of customer inquiries automatically, reducing response time from hours to seconds.',
    cover:
      'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=500&fit=crop',
    category: 'AI Automation',
    techStack: ['OpenAI', 'Python', 'Zapier', 'Slack API'],
    results: [
      { label: 'Response Time', value: '-95%' },
      { label: 'Inquiries Automated', value: '80%' },
      { label: 'Customer Satisfaction', value: '+32%' },
    ],
  },
  {
    id: 'proj-2',
    title: 'GoHighLevel Agency Funnel',
    description:
      'Designed and built a complete GHL funnel for a marketing agency including landing pages, pipelines, calendars, and SMS automations.',
    cover:
      'https://images.unsplash.com/photo-1460925895917-afdabca5b1ce?w=800&h=500&fit=crop',
    category: 'GoHighLevel',
    techStack: ['GoHighLevel', 'Funnels', 'SMS Automation', 'Calendars'],
    results: [
      { label: 'Conversion Rate', value: '+45%' },
      { label: 'Booked Calls', value: '+120/mo' },
      { label: 'Setup Time', value: '5 days' },
    ],
  },
  {
    id: 'proj-3',
    title: 'Cold Email Infrastructure',
    description:
      'Set up a complete cold email system with 10 warmed domains, personalized sequences, and automated reply tracking for a B2B SaaS company.',
    cover:
      'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&h=500&fit=crop',
    category: 'Cold Email',
    techStack: ['Instantly', 'Mailgun', 'Zapier', 'Google Workspace'],
    results: [
      { label: 'Open Rate', value: '62%' },
      { label: 'Reply Rate', value: '8.5%' },
      { label: 'Meetings Booked', value: '30+/mo' },
    ],
  },
  {
    id: 'proj-4',
    title: 'Automation Workflow System',
    description:
      'Created a multi-step automation workflow connecting a client\'s CRM, email, Slack, and project management tools to eliminate manual data entry.',
    cover:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    category: 'Automation',
    techStack: ['Make.com', 'Notion API', 'Slack', 'Airtable'],
    results: [
      { label: 'Hours Saved', value: '30/week' },
      { label: 'Manual Tasks', value: '-100%' },
      { label: 'Error Rate', value: '0%' },
    ],
  },
  {
    id: 'proj-5',
    title: 'Portfolio Website Redesign',
    description:
      'Redesigned a consultant\'s portfolio website with modern UI, fast load times, and SEO optimization resulting in a significant traffic increase.',
    cover:
      'https://images.unsplash.com/photo-1467232007581-60ddf2088afb?w=800&h=500&fit=crop',
    category: 'Web Development',
    techStack: ['Next.js', 'TailwindCSS', 'Vercel', 'SEO'],
    results: [
      { label: 'Load Time', value: '0.8s' },
      { label: 'Organic Traffic', value: '+210%' },
      { label: 'Lighthouse', value: '98' },
    ],
  },
  {
    id: 'proj-6',
    title: 'Lead Gen Multi-Channel Campaign',
    description:
      'Launched a multi-channel lead generation campaign combining cold email, LinkedIn outreach, and automated follow-ups for a coaching business.',
    cover:
      'https://images.unsplash.com/photo-1611926653458-0929b18bdf24?w=800&h=500&fit=crop',
    category: 'Lead Generation',
    techStack: ['LinkedIn', 'Instantly', 'HubSpot', 'Calendly'],
    results: [
      { label: 'Leads Generated', value: '150+' },
      { label: 'Cost per Lead', value: '-40%' },
      { label: 'Conversion', value: '12%' },
    ],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 'tst-1',
    name: 'Jessica Morrison',
    role: 'Founder',
    company: 'Morrison Digital Agency',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    rating: 5,
    quote:
      'Samme transformed our entire operations. The automations he built saved us 25 hours every week and our lead flow has never been better. His GHL expertise is unmatched.',
  },
  {
    id: 'tst-2',
    name: 'David Chen',
    role: 'CEO',
    company: 'Chen SaaS Group',
    avatar:
      'https://images.unsplash.com/photo-1500648766838-1a5b9a1f1f1e?w=200&h=200&fit=crop',
    rating: 5,
    quote:
      'The cold email system Samme set up for us generated 30+ qualified meetings in the first month. His attention to deliverability and detail is incredible.',
  },
  {
    id: 'tst-3',
    name: 'Sarah Williams',
    role: 'Marketing Director',
    company: 'GrowthLab',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    rating: 5,
    quote:
      'Working with Samme was a game-changer. He built our entire GoHighLevel setup in under a week and our booked calls doubled immediately. Highly recommend.',
  },
  {
    id: 'tst-4',
    name: 'Michael Brown',
    role: 'Agency Owner',
    company: 'Brown Consulting',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    rating: 5,
    quote:
      'Samme is the most reliable virtual assistant I have ever worked with. He anticipates problems before they happen and always delivers ahead of schedule.',
  },
  {
    id: 'tst-5',
    name: 'Emily Rodriguez',
    role: 'Operations Manager',
    company: 'ScaleUp Inc.',
    avatar:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
    rating: 5,
    quote:
      'The AI chatbot Samme built handles 80% of our customer support automatically. Our team can finally focus on high-value work instead of answering the same questions.',
  },
];

export const posts: Post[] = [
  {
    id: 'post-1',
    type: 'case-study',
    timestamp: '2 days ago',
    title: 'How I Automated a Client\'s Entire Sales Pipeline',
    content:
      'Just wrapped up a project where I connected GoHighLevel, Calendly, and a custom AI chatbot to automate a client\'s entire sales pipeline. Here\'s what happened:\n\n1. Leads come in from Facebook Ads\n2. AI chatbot qualifies them instantly\n3. Qualified leads get booked automatically\n4. CRM updates in real-time\n\nResult: 45% increase in booked calls and the client\'s team saves 20+ hours per week. The key? Mapping the entire customer journey BEFORE building any automation.',
    tags: ['GoHighLevel', 'AI Automation', 'Case Study'],
    likes: 142,
    comments: 38,
    shares: 27,
    category: 'Case Study',
  },
  {
    id: 'post-2',
    type: 'image',
    timestamp: '4 days ago',
    title: 'Cold Email Open Rates That Actually Work',
    content:
      'Most cold emails get ignored. Here\'s the framework I use to consistently hit 60%+ open rates:\n\n- Warm your domains for 2+ weeks\n- Keep subject lines under 5 words\n- Personalize the first line (not just "Hi [Name]")\n- Send 1 email per domain per day max\n- Use a 3-step sequence, not 7\n\nQuality over quantity. Always.',
    image:
      'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&h=500&fit=crop',
    tags: ['Cold Email', 'Marketing', 'Lessons Learned'],
    likes: 98,
    comments: 24,
    shares: 15,
    category: 'Cold Email Lessons',
  },
  // A 'youtube' post is supported by PostCard — add one back with a real video ID:
  // { id: 'post-3', type: 'youtube', youtubeId: '<real-id>', ... }
  {
    id: 'post-4',
    type: 'text',
    timestamp: '1 week ago',
    title: 'The One Automation Every Business Needs',
    content:
      'If I could set up just ONE automation for any business, it would be this:\n\nNew Lead → Instant AI Response → Qualification Questions → Auto-Book Call → CRM Update → Slack Notification\n\nThis single workflow can transform how fast you respond to leads. Speed to lead is everything. Studies show responding within 5 minutes makes you 21x more likely to qualify the lead.',
    tags: ['Automation', 'Business', 'Marketing Insights'],
    likes: 187,
    comments: 45,
    shares: 33,
    category: 'Marketing Insights',
  },
  {
    id: 'post-5',
    type: 'carousel',
    timestamp: '2 weeks ago',
    title: '5 GoHighLevel Features Most Agencies Ignore',
    content:
      'Most agencies only use 20% of GoHighLevel\'s features. Here are 5 hidden gems that can transform your operations:\n\n1. Workflows with conditional logic\n2. Automated review requests\n3. Pipeline stage automations\n4. SMS templates with custom fields\n5. Reporting dashboards for clients\n\nWhich one are you not using yet?',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdabca5b1ce?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=500&fit=crop',
    ],
    tags: ['GoHighLevel', 'Tutorial', 'Marketing'],
    likes: 156,
    comments: 31,
    shares: 22,
    category: 'Business Updates',
  },
  {
    id: 'post-6',
    type: 'image',
    timestamp: '3 weeks ago',
    title: 'Website Project: From Concept to Launch in 5 Days',
    content:
      'Just launched a new website for a consulting client. Built with Next.js, optimized for speed and SEO, and deployed on Vercel. Key metrics:\n\n- Lighthouse score: 98\n- Load time: 0.8 seconds\n- Mobile-first responsive design\n- SEO optimized from day one\n\nFast websites convert better. Period.',
    image:
      'https://images.unsplash.com/photo-1467232007581-60ddf2088afb?w=800&h=500&fit=crop',
    tags: ['Web Development', 'Project', 'SEO'],
    likes: 134,
    comments: 28,
    shares: 19,
    category: 'Website Projects',
  },
];

export const resources: Resource[] = [
  {
    id: 'res-1',
    title: 'AI Prompt Library for Business',
    description:
      '50+ ready-to-use AI prompts for marketing, sales, content creation, and operations. Copy, paste, and scale.',
    type: 'Prompt Library',
    icon: 'Sparkles',
    link: '/resources/ai-prompt-library.pdf',
    pages: '31 pages',
  },
  {
    id: 'res-2',
    title: 'Cold Email Playbook',
    description:
      'A step-by-step guide to setting up cold email infrastructure that lands in the inbox and gets replies.',
    type: 'Lead Magnet',
    icon: 'Mail',
    link: '/resources/cold-email-playbook.pdf',
    pages: '20 pages',
  },
  {
    id: 'res-3',
    title: 'GoHighLevel Setup Checklist',
    description:
      'The exact 47-point checklist I use to set up GoHighLevel accounts for clients from zero to launch.',
    type: 'Lead Magnet',
    icon: 'ListChecks',
    link: '/resources/ghl-setup-checklist.pdf',
    pages: '9 pages',
  },
  {
    id: 'res-4',
    title: 'Automation Workflow Templates',
    description:
      '12 pre-built Make.com and Zapier workflow templates you can import and customize for your business.',
    type: 'Template Pack',
    icon: 'Workflow',
    link: '/resources/automation-workflow-templates.pdf',
    pages: '15 pages',
  },
];

export const timeline: TimelineEvent[] = [
  {
    year: '2025',
    title: 'AI Engineer & GHL Expert',
    description:
      'Specializing in AI automation and GoHighLevel systems, helping agencies and entrepreneurs scale operations.',
  },
  {
    year: '2023',
    title: 'Virtual Assistant at VMedia',
    description:
      'Joined VMedia full-time, managing operations, automations, and CRM systems for a growing digital media company.',
  },
  {
    year: '2022',
    title: 'Cybersecurity Internship',
    description:
      'Completed a penetration testing internship at Creative relay, gaining hands-on security experience.',
  },
  {
    year: '2021',
    title: 'Started Software Engineering Degree',
    description:
      'Began Bachelor of Science in Software Engineering at Landmark Metropolitan University.',
  },
  {
    year: '2019',
    title: 'Foundation in Software Engineering',
    description:
      'Earned a Higher National Diploma in Software Engineering from Catholic University Institute of Buea.',
  },
];

export const stats: Stat[] = [
  { label: 'Projects Completed', value: 50, suffix: '+' },
  { label: 'Hours Saved per Client', value: 25, suffix: '/wk' },
  { label: 'Client Satisfaction', value: 98, suffix: '%' },
  { label: 'Years of Experience', value: 3, suffix: '+' },
];

export const coreValues: CoreValue[] = [
  {
    title: 'Reliability',
    description:
      'I deliver on time, every time. When I commit to a deadline, I meet it.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Innovation',
    description:
      'I stay ahead of the curve with AI, automation, and the latest marketing technology.',
    icon: 'Lightbulb',
  },
  {
    title: 'Results-Driven',
    description:
      'Every system I build is designed to produce measurable business outcomes.',
    icon: 'TrendingUp',
  },
  {
    title: 'Transparency',
    description:
      'Clear communication, honest timelines, and no hidden surprises. Ever.',
    icon: 'Eye',
  },
];

/**
 * Add real, dated events here and the "Upcoming Events" card in the right
 * sidebar renders itself automatically. Left empty deliberately — the card
 * hides rather than advertising events that have already passed.
 */
export const upcomingEvents: { title: string; date: string; type: string }[] =
  [];
