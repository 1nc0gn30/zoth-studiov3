export interface TestimonialItem {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
  avatarAlt?: string;
}

export interface TestimonialData {
  eyebrow?: string;
  heading?: string;
  subtext?: string;
  items?: TestimonialItem[];
  cvariant?: string;
}
