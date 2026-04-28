export interface LogoItem {
  name: string;
  src: string;
  url?: string;
  alt?: string;
}

export interface LogoTickerData {
  eyebrow?: string;
  heading?: string;
  subtext?: string;
  items?: LogoItem[];
  cvariant?: string;
}
