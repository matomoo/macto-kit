import { Banknote, ChartBar, Fingerprint, LayoutDashboard, type LucideIcon } from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboards",
    items: [
      {
        title: "Default",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: 2,
    label: "Gefr Monitoring",
    items: [
      {
        title: "2G NOP",
        url: "#",
        icon: Fingerprint,
        subItems: [
          {
            title: "2G NOP Level Daily",
            url: "/gefr/monitoring/v2/2g/nop/daily",
          },
          {
            title: "2G NOP Level Hourly",
            url: "/gefr/monitoring/v2/2g/nop/hourly",
          },
        ],
      },
      {
        title: "2G Site",
        url: "#",
        icon: Fingerprint,
        subItems: [
          {
            title: "2G Site Level Daily",
            url: "/gefr/monitoring/v2/2g/site/daily",
          },
          {
            title: "2G Site Level Hourly",
            url: "/gefr/monitoring/v2/2g/site/hourly",
          },
        ],
      },
      {
        title: "4G Site",
        url: "#",
        icon: Fingerprint,
        subItems: [
          {
            title: "4G Site Level Daily",
            url: "/gefr/monitoring/v2/4g/site/daily",
          },
          // {
          //   title: "4G Site Level Hourly",
          //   url: "/gefr/monitoring/v2/4g/site/hourly",
          // },
        ],
      },
    ],
  },
];
