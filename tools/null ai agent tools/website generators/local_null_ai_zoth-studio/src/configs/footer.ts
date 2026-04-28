export interface FooterSocial {
  platform: string;
  url: string;
}

export interface FooterData {
  copyright?: string;
  showStatus?: boolean;
  statusText?: string;
  socialNavAria?: string;
  socials?: FooterSocial[];
  cvariant?: string;
}
