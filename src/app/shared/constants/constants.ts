import {StatCardData} from "../../core/models/filter.model";

export const NAV_SECTIONS = [
  {
    title: 'Analytics',
    items: [
      { label: 'Sale Report', icon: 'assets/icons/sidebar/sale-report.png', route: '/dashboard', active: true },
      { label: 'Stock Status', icon: 'assets/icons/sidebar/stock-status.png', route: '/stock' },
      { label: 'Sample Placement', icon: 'assets/icons/sidebar/sample-placement.png', route: '/placement' },
      { label: 'Trade Marketing', icon: 'assets/icons/sidebar/trade-marketing.png', route: '/marketing' },
      { label: 'Brand Share', icon: 'assets/icons/sidebar/brand-share.png', route: '/brand-share' }
    ]
  },
  {
    title: 'Management',
    items: [
      { label: 'Stores', icon: 'assets/icons/sidebar/stores.png', route: '/stores' },
      { label: 'Products', icon: 'assets/icons/sidebar/products.png', route: '/products' },
    ]
  }
];

export const SIDEBAR_FOOTER_TABS = [
  {
    icon: 'assets/icons/sidebar/settings.png',
    title: 'Settings',
  },
  {
    icon: 'assets/icons/sidebar/help.png',
    title: 'Help & Support'
  }
];

export const statCards: StatCardData[] = [
  {
    title: 'Revenue',
    slug: 'revenue',
  },
  {
    title: 'Quantity',
    slug: 'quantity'
  },
  {
    title: 'Avg Order',
    slug: 'avg_order'
  },
  {
    title: 'Products',
    slug: 'products',
  }
];



