export type PricingPeriod = 'month' | 'year' | 'forever' | '';

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingTier {
  name: string;
  price: string;
  period?: PricingPeriod;
  description?: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

export interface PricingData {
  eyebrow?: string;
  heading?: string;
  subtext?: string;
  tiers?: PricingTier[];
  cvariant?: string;
}
