export interface ContentCTA {
  label: string;
  url: string;
}

export interface ContentColumn {
  eyebrow?: string;
  title: string;
  text: string;
  items?: string[];
}

export interface ContentStat {
  label: string;
  value: string;
}

export interface ContentData {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  paragraphs?: string[];
  columns?: ContentColumn[];
  stats?: ContentStat[];
  cta?: ContentCTA;
}
