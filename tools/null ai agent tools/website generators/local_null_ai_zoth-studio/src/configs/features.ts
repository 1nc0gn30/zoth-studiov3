export type FeatureButtonVariant = 'primary' | 'secondary';

export interface FeatureButton {
  label: string;
  url: string;
  variant?: FeatureButtonVariant;
}

export interface FeatureItem {
  title: string;
  description: string;
  kicker?: string;
  metric?: string;
  icon?: string;
}

export interface FeaturesData {
  eyebrow?: string;
  heading?: string;
  subtext?: string;
  items?: FeatureItem[];
  buttons?: FeatureButton[];
  cvariant?: string;
}
