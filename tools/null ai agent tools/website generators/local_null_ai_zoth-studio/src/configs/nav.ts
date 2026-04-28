export interface NavChildItem {
  label: string;
  url: string;
}

export interface NavItem {
  label: string;
  url: string;
  type?: 'link' | 'button' | 'dropdown';
  children?: NavChildItem[];
}

export interface NavData {
  homeUrl?: string;
  labels?: {
    homeAria?: string;
    menuToggle?: string;
    menuSrOnly?: string;
    primaryNav?: string;
    dropdownPrefix?: string;
  };
  brand?: {
    name?: string;
    logoUrl?: string;
    showLogo?: boolean;
    showTitle?: boolean;
    fallbackIcon?: string;
  };
  settings?: {
    sticky?: boolean;
    glassmorphism?: boolean;
    mobileBreakpoint?: string;
    stickyOffset?: string;
  };
  menu?: NavItem[];
  cta?: {
    label?: string;
    url?: string;
    style?: string;
  };
  cvariant?: string;
}
