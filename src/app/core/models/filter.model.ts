export interface DateRange {
  start: string | null;
  end: string | null;
}

export interface SalesFilters {
  brand: string | null;
  category: string | null;
  subcategory: string | null;
  product: string | null;
  retailer: string | null;
  store: string | null;
  dateRange: DateRange;
}

export interface ActiveFilter {
  type: keyof SalesFilters | 'dateRange';
  value: string;
  label?: string;
}

export interface FilterOption {
  value: string | null;
  label: string;
  count?: number;
}

export interface StatCardData {
  title: string;
  slug: string;
}
