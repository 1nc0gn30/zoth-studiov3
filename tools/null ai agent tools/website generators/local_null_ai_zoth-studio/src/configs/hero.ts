export type HeroButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface HeroButton {
  label: string;
  url: string;
  variant?: HeroButtonVariant;
}

export interface HeroStat {
  label: string;
  value: string;
}

export interface HeroHighlight {
  title: string;
  description: string;
}

export interface HeroImage {
  src: string;
  alt: string;
}

export interface HeroMediaSet {
  desktopSrc?: string;
  mobileSrc?: string;
  fallbackSrc?: string;
  alt?: string;
  src?: string;
}

export interface HeroData {
  eyebrow?: string;
  heading?: string;
  headingAccent?: string;
  subtext?: string;
  proofPoints?: string[];
  buttons?: HeroButton[];
  stats?: HeroStat[];
  highlights?: HeroHighlight[];
  image?: HeroImage;
  media?: HeroMediaSet;
  cvariant?: string;
}
