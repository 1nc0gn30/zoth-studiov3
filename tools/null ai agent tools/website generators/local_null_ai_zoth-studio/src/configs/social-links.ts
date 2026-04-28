export interface SocialLinkItem {
  label: string;
  url: string;
  handle?: string;
  description?: string;
  platform?: string;
}

export interface SocialLinksData {
  eyebrow?: string;
  heading?: string;
  subtext?: string;
  links?: SocialLinkItem[];
  cvariant?: string;
}
