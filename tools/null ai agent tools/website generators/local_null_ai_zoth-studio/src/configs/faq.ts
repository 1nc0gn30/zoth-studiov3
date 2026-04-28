export interface FAQItem {
  question: string;
  answer: string;
  open?: boolean;
}

export interface FAQData {
  eyebrow?: string;
  heading?: string;
  subtext?: string;
  items?: FAQItem[];
  cvariant?: string;
}
