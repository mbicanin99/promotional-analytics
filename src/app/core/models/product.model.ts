export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
}

export interface ProductHierarchy {
  brand: string;
  categories: {
    [category: string]: string[]; // subcategories
  };
}
