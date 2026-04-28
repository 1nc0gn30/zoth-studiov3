export type UIKitActionStyle = 'primary' | 'secondary' | 'ghost';

export interface UIKitAction {
  label: string;
  url: string;
  style?: UIKitActionStyle;
}

export interface UIKitItem {
  title: string;
  description?: string;
  badge?: string;
  meta?: string;
  href?: string;
  image?: string;
}

export interface UIKitData {
  eyebrow?: string;
  heading?: string;
  subtext?: string;
  notes?: string[];
  actions?: UIKitAction[];
  items?: UIKitItem[];
  cvariant?: string;
}
