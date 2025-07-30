import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Store } from '../models/store.model';
import { Sale } from '../models/sale.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private readonly brands = ['Stark', 'Jaffa', 'Imlek', 'Frikom', 'Knjaz Miloš'];
  private readonly categories = ['Snacks', 'Beverages', 'Dairy', 'Frozen'];
  private readonly subcategories: { [key: string]: string[] } = {
    'Snacks': ['Chips', 'Crackers', 'Peanuts', 'Candy'],
    'Beverages': ['Carbonated', 'Juices', 'Mineral Water', 'Energy Drinks'],
    'Dairy': ['Milk', 'Cheese', 'Yogurt', 'Butter'],
    'Frozen': ['Ice Cream', 'Pizza', 'Vegetables', 'Meals']
  };
  private brandCategoriesMap: { [brand: string]: string[] } = {
    'Stark': ['Snacks'],
    'Jaffa': ['Snacks', 'Beverages'],
    'Imlek': ['Dairy'],
    'Frikom': ['Frozen', 'Beverages'],
    'Knjaz Miloš': ['Beverages']
  };
  private readonly retailers = ['Maxi', 'Idea', 'Lidl', 'Dis', 'Metro'];
  private readonly cities = ['Beograd', 'Novi Sad', 'Niš', 'Kragujevac', 'Subotica'];

  generateMockData(): { stores: Store[], products: Product[], salesData: Sale[] } {
    const stores = this.generateStores();
    const products = this.generateProducts();
    const salesData = this.generateSalesData(stores, products);
    return { stores, products, salesData };
  }

  private generateStores(): Store[] {
    const stores: Store[] = [];
    this.retailers.forEach(retailer => {
      this.cities.forEach((city, index) => {
        stores.push({
          id: `${retailer.toLowerCase()}-${index + 1}`,
          name: `${retailer} Store ${index + 1}`,
          retailer: retailer,
          city: city,
          address: `${100 + index} Main St, ${city}`,
          manager: `Manager ${index + 1}`
        });
      });
    });
    return stores;
  }

  private generateProducts(): Product[] {
    const products: Product[] = [];
    let productId = 1;
    this.brands.forEach(brand => {
      const categoriesForBrand = this.brandCategoriesMap[brand] || [];
      categoriesForBrand.forEach(category => {
        const subcategories = this.subcategories[category] || [];
        subcategories.forEach(subcategory => {
          for (let i = 1; i <= 3; i++) {
            products.push({
              id: `SKU${productId++}`,
              name: `${brand} ${subcategory} Product ${i}`,
              brand: brand,
              category: category,
              subcategory: subcategory,
              price: this.getPriceForCategory(category)
            });
          }
        });
      });
    });
    return products;
  }

  private generateSalesData(stores: Store[], products: Product[]): Sale[] {
    const salesData: Sale[] = [];
    const now = new Date();
    let saleId = 1;
    for (let daysAgo = 30; daysAgo >= 0; daysAgo--) {
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);
      const dateStr = date.toISOString().split('T')[0];
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      stores.forEach(store => {
        const numProducts = isWeekend ? this.randomBetween(20, 40) : this.randomBetween(10, 25);
        const soldProducts = this.shuffleArray([...products]).slice(0, numProducts);
        soldProducts.forEach(product => {
          const quantity = store.retailer === 'Metro'
            ? this.randomBetween(10, 60)
            : this.randomBetween(1, 40);
          const revenue = quantity * product.price;
          salesData.push({
            id: `sale-${saleId++}`,
            date: dateStr,
            storeId: store.id,
            storeName: store.name,
            retailer: store.retailer,
            productId: product.id,
            productName: product.name,
            brand: product.brand,
            category: product.category,
            subcategory: product.subcategory,
            quantity: quantity,
            price: product.price,
            revenue: revenue
          });
        });
      });
    }
    return salesData;
  }

  private getPriceForCategory(category: string): number {
    switch (category) {
      case 'Dairy':
        return this.randomBetween(1, 5);
      case 'Beverages':
        return this.randomBetween(2, 7);
      case 'Frozen':
        return this.randomBetween(5, 15);
      case 'Snacks':
        return this.randomBetween(1, 6);
      default:
        return this.randomBetween(2, 10);
    }
  }

  private randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
