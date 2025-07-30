export interface Store {
  id: string;
  name: string;
  retailer: string;
  city: string;
  address?: string;
  manager?: string;
}

export interface Retailer {
  id: string;
  name: string;
  storeCount: number;
}
