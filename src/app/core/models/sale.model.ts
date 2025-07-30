export interface Sale {
  id: string;
  date: string;
  storeId: string;
  storeName: string;
  retailer: string;
  productId: string;
  productName: string;
  brand: string;
  category: string;
  subcategory: string;
  quantity: number;
  price: number;
  revenue: number;
}

export interface SalesSummary {
  totalRevenue: number;
  totalQuantity: number;
  averageOrderValue: number;
  uniqueProducts: number;
}

export interface ChartData {
  labels: string[];
  data: number[];
}
