export interface TeamSocialLink {
  platform: string;
  url: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
  avatarAlt?: string;
  socials?: TeamSocialLink[];
}

export interface TeamData {
  eyebrow?: string;
  heading?: string;
  subtext?: string;
  members?: TeamMember[];
  cvariant?: string;
}
