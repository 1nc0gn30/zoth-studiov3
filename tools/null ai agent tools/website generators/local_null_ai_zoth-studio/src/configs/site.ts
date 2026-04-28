import rawFooter from './footer.json';
import rawNavigation from './navigation.json';
import rawSite from './site.json';
import type { FooterData } from './footer';
import type { NavData } from './nav';

export interface SEOData {
  title: string;
  description: string;
  ogImage?: string;
  keywords?: string[];
  author?: string;
}

export interface SiteConfig {
  brandName: string;
  themeVariant?: string;
  navVariant?: string;
  footerVariant?: string;
  defaultSeo: SEOData;
  navigation: NavData;
  footer: FooterData;
}

const siteConfig: SiteConfig = {
  ...(rawSite as Omit<SiteConfig, 'navigation' | 'footer'>),
  navigation: rawNavigation as NavData,
  footer: rawFooter as FooterData,
};

export default siteConfig;
