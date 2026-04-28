export type CTAButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface CTAButton {
  label: string;
  url: string;
  variant?: CTAButtonVariant;
}

export interface CTAData {
  eyebrow?: string;
  heading?: string;
  subtext?: string;
  buttons?: CTAButton[];
  backgroundImage?: string;
  backgroundAlt?: string;
  cvariant?: string;
}
