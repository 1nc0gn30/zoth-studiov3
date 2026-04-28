export interface StatItem {
  value: string;
  label: string;
  description?: string;
}

export interface StatsData {
  eyebrow?: string;
  heading?: string;
  subtext?: string;
  items?: StatItem[];
  cvariant?: string;
}
