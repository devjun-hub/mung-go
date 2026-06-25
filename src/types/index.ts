/**
 * TypeScript interface definitions for the MungGo project.
 * Ensure readability, maintainability, and clean typing across components.
 */

export interface DiaryEntry {
  emoji: string;
  mood: string;
  text: string;
  date: string;
}

export interface DogProfile {
  name: string;
  size: '소형' | '중형' | '대형';
  breed?: string;
}

export interface NavItem {
  label: string;
  go: () => void;
  tile: React.CSSProperties;
  text: React.CSSProperties;
}

export interface SidebarProps {
  menu: boolean;
  menuSubtitle: string;
  navItems: NavItem[];
  accountLabel: string;
  accountBg: string;
  accountColor: string;
  accountBorder: string;
  accountAction: () => void;
  closeMenu: () => void;
}

export interface HomeProps {
  loggedIn: boolean;
  dogName: string;
  locationText: string;
  goWrite: () => void;
  goMap: () => void;
  goDetail: () => void;
  goTravel: () => void;
  goAccount: () => void;
  openMenu: () => void;
}

export interface TravelListProps {
  goHome: () => void;
  goDetail: () => void;
}

export interface DetailProps {
  goTravel: () => void;
}

export interface MapScreenProps {
  openMenu: () => void;
  goHome: () => void;
}

export interface DiaryListProps {
  dogTitle: string;
  entryCountLabel: string;
  entryCount: number;
  entries: DiaryEntry[];
  goHome: () => void;
  goWrite: () => void;
}

export interface DiaryWriteProps {
  draftText: string;
  draftLen: number;
  todayLabel: string;
  saveColor: string;
  emojiOptions: Array<{
    char: string;
    mood: string;
    pick: () => void;
    box: React.CSSProperties;
    label: React.CSSProperties;
  }>;
  onDraftText: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  saveDiary: () => void;
  goDiary: () => void;
}

export interface SignupWizardProps {
  signupStep: number;
  welcomeLine: string;
  dogName: string;
  dot0: React.CSSProperties;
  dot1: React.CSSProperties;
  dot2: React.CSSProperties;
  sizeOptions: Array<{
    label: string;
    pick: () => void;
    box: React.CSSProperties;
  }>;
  onDogName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  signupNext: () => void;
  signupBack: () => void;
  finishSignup: () => void;
  goHome: () => void;
}

export interface MyPageProps {
  dogTitle: string;
  dogSize: string;
  entryCount: number;
  goHome: () => void;
  goDiary: () => void;
  logout: () => void;
}
