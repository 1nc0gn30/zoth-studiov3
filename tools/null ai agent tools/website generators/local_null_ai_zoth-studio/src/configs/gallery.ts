export interface GalleryItem {
  src: string;
  alt: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
}

export interface GalleryData {
  eyebrow?: string;
  heading?: string;
  subtext?: string;
  items?: GalleryItem[];
}
