export interface NavItem {
  to: string;
  icon: string;
  label: string;
}

export const mainNavigation: NavItem[] = [
  {
    to: "/app",
    icon: "uil:home",
    label: "menu.home",
  },
  {
    to: "/app/settings",
    icon: "uil:setting",
    label: "menu.settings",
  },
];
