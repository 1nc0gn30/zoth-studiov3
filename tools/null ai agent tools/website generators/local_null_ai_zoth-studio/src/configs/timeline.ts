export interface TimelineItem {
  date: string;
  title: string;
  description: string;
  milestone?: boolean;
  image?: string;
}

export interface TimelineData {
  eyebrow?: string;
  heading?: string;
  subtext?: string;
  items?: TimelineItem[];
  cvariant?: string;
}
