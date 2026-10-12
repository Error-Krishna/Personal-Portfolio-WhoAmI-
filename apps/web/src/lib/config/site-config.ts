import rawConfig from '../../content/site_config.json';

export interface PersonalConfig {
  name: string;
  displayName: string;
  title: string;
  headline: string;
  location: string;
  graduationYear: number;
  email: string;
  availability: string;
  availabilityLabel: string;
  shortBio: string;
  timezone: string;
  responseTime: string;
}

export interface LinksConfig {
  github: string;
  linkedin: string;
  email: string;
  phone: string;
  resume: string;
  portfolio: string;
  twitter?: string;
  youtube?: string;
  instagram?: string;
}

export interface AssetsConfig {
  heroPortrait: string;
  aboutPortrait: string;
  contactPortrait: string;
  resume: string;
  ogImage: string;
}

export interface PricingConfig {
  currency: string;
  displayCurrency: string;
  showPricing: boolean;
  showHourlyRate: boolean;
  hourlyRate: number | null;
  minimumProjectBudget: number | null;
  customQuoteLabel: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  category: string;
  visible: boolean;
  startingPrice: number | null;
  currency: string;
  pricingModel: 'fixed' | 'starting_at' | 'quote' | string;
  deliverables: string[];
  exclusions?: string[];
  estimatedDelivery?: string;
  revisionAllowance?: number | null;
  supportPeriod?: string;
  featured: boolean;
  ctaLabel: string;
  ctaDestination: string;
}

export interface SkillItem {
  name: string;
  category: 'FRONTEND' | 'BACKEND' | 'DATABASES' | 'TOOLS' | 'CREATIVE' | string;
  icon: string;
  description?: string;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  category: string;
  status: string;
  featured: boolean;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  backendGithubUrl?: string;
  demoUrl?: string;
  role: string;
  date: string;
  overview: string;
  problem: string;
  solution: string;
  features: string[];
  myContribution?: string;
}

export interface ExperienceItem {
  period: string;
  organization: string;
  role: string;
  category: string;
  description: string;
  link?: string;
}

export interface CreativeWorkItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tools: string[];
  status: string;
  link?: string;
}

export interface TrustPrincipleItem {
  number: string;
  title: string;
  description: string;
}

export interface ContactConfig {
  heading: string;
  subheading: string;
  email: string;
  projectTypes: string[];
  budgetOptions: string[];
  timelineOptions: string[];
  successMessage: string;
}

export interface SectionVisibilityConfig {
  hero: boolean;
  about: boolean;
  skills: boolean;
  projects: boolean;
  services: boolean;
  experience: boolean;
  creative: boolean;
  trust: boolean;
  contact: boolean;
  footer: boolean;
}

export interface SiteConfig {
  personal: PersonalConfig;
  links: LinksConfig;
  assets: AssetsConfig;
  pricing: PricingConfig;
  services: ServiceItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  creativeWorks: CreativeWorkItem[];
  trustPrinciples: TrustPrincipleItem[];
  contact: ContactConfig;
  sectionVisibility: SectionVisibilityConfig;
}

// Safely typed singleton site configuration
export const siteConfig: SiteConfig = rawConfig as unknown as SiteConfig;

// Helper utilities for resilient UI rendering
export const isValidUrl = (url?: string | null): boolean => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed === '' || trimmed === '#') return false;
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#')
  );
};

export const formatPrice = (
  amount: number | null | undefined,
  currency: string = siteConfig.pricing.currency || 'USD',
  fallbackLabel: string = siteConfig.pricing.customQuoteLabel || 'Request a Quote'
): string => {
  if (amount === null || amount === undefined || isNaN(amount) || amount <= 0) {
    return fallbackLabel;
  }
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'INR' ? '₹' : `${currency} `;
  return `Starting at ${symbol}${amount.toLocaleString()}`;
};

export const getVisibleServices = (): ServiceItem[] => {
  return (siteConfig.services || []).filter((s) => s.visible !== false);
};

export const getFeaturedProjects = (): ProjectItem[] => {
  return (siteConfig.projects || []).filter((p) => p.featured);
};

export const getAllProjects = (): ProjectItem[] => {
  return siteConfig.projects || [];
};

export const getProjectBySlug = (slug: string): ProjectItem | undefined => {
  return (siteConfig.projects || []).find(
    (p) => p.slug.toLowerCase() === slug.toLowerCase() || p.id.toLowerCase() === slug.toLowerCase()
  );
};

export const getSafeAsset = (assetPath?: string | null, fallback: string = ''): string => {
  if (!assetPath || assetPath.trim() === '') return fallback;
  return assetPath;
};
