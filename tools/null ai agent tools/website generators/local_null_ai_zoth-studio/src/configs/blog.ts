export interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image?: string;
  imageAlt?: string;
  tags?: string[];
  url?: string;
}

export interface BlogData {
  eyebrow?: string;
  heading?: string;
  subtext?: string;
  posts?: BlogPost[];
  cvariant?: string;
}
