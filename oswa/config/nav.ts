export interface NavItem {
  id: string;
  translationKey: string;
  path: string;
  devOnly?: boolean;
  icon?: string;
}

export const navItems: NavItem[] = [
  { id: 'home', translationKey: 'home', path: '/' },
  { id: 'wisdom', translationKey: 'wisdom', path: '/wisdom' },
  { id: 'kids', translationKey: 'kids', path: '/kids' },
  { id: 'design', translationKey: 'design', path: '/design', devOnly: true },
];
