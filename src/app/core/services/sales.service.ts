import { Injectable, signal, computed } from '@angular/core';
import { MockDataService } from './mock-data.service';
import { Sale, SalesSummary, ChartData } from '../models/sale.model';
import { Store } from '../models/store.model';
import { Product } from '../models/product.model';
import { SalesFilters, ActiveFilter } from '../models/filter.model';

interface SalesState {
  salesData: Sale[];
  stores: Store[];
  products: Product[];
  filters: SalesFilters;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private state = signal<SalesState>({
    salesData: [],
    stores: [],
    products: [],
    filters: {
      brand: null,
      category: null,
      subcategory: null,
      product: null,
      retailer: null,
      store: null,
      dateRange: { start: null, end: null }
    },
    loading: false,
    error: null
  });

  readonly salesData = computed(() => this.state().salesData);
  readonly stores = computed(() => this.state().stores);
  readonly products = computed(() => this.state().products);
  readonly filters = computed(() => this.state().filters);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  readonly brands = computed(() => {
    const brands = new Set(this.products().map(p => p.brand));
    return Array.from(brands).sort();
  });

  readonly categories = computed(() => {
    const categories = new Set(this.products().map(p => p.category));
    return Array.from(categories).sort();
  });

  readonly filteredBrands = computed(() => {
    const category = this.filters().category;
    if (!category) {
      return this.brands();
    }
    const brandsSet = new Set(
      this.products()
        .filter(p => p.category === category)
        .map(p => p.brand)
    );
    return Array.from(brandsSet).sort();
  });

  readonly filteredCategories = computed(() => {
    const brand = this.filters().brand;
    if (!brand) {
      return this.categories(); // sve kategorije ako nije izabran brand
    }
    const categoriesSet = new Set(
      this.products()
        .filter(p => p.brand === brand)
        .map(p => p.category)
    );
    return Array.from(categoriesSet).sort();
  });

  readonly subcategories = computed(() => {
    const brand = this.filters().brand;
    const category = this.filters().category;

    const subs = new Set(
      this.products()
        .filter(p =>
          (!brand || p.brand === brand) &&
          (!category || p.category === category)
        )
        .map(p => p.subcategory)
    );
    return Array.from(subs).sort();
  });

  readonly productNames = computed(() => {
    const brand = this.filters().brand;
    const category = this.filters().category;
    const subcategory = this.filters().subcategory;

    const names = new Set(
      this.products()
        .filter(p =>
          (!brand || p.brand === brand) &&
          (!category || p.category === category) &&
          (!subcategory || p.subcategory === subcategory)
        )
        .map(p => p.name)
    );
    return Array.from(names).sort();
  });

  readonly retailers = computed(() => {
    const retailers = new Set(this.stores().map(s => s.retailer));
    return Array.from(retailers).sort();
  });

  readonly filteredSales = computed(() => {
    let sales = this.salesData();
    const filters = this.filters();

    if (filters.brand) {
      sales = sales.filter(s => s.brand === filters.brand);
    }
    if (filters.category) {
      sales = sales.filter(s => s.category === filters.category);
    }
    if (filters.subcategory) {
      sales = sales.filter(s => s.subcategory === filters.subcategory);
    }
    if (filters.product) {
      sales = sales.filter(s => s.productName === filters.product);
    }
    if (filters.retailer) {
      sales = sales.filter(s => s.retailer === filters.retailer);
    }
    if (filters.store) {
      sales = sales.filter(s => s.storeId === filters.store);
    }
    if (filters.dateRange.start) {
      sales = sales.filter(s => s.date >= filters.dateRange.start!);
    }
    if (filters.dateRange.end) {
      sales = sales.filter(s => s.date <= filters.dateRange.end!);
    }

    return sales;
  });

  readonly summary = computed<SalesSummary>(() => {
    const sales = this.filteredSales();
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.revenue, 0);
    const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);
    const uniqueProducts = new Set(sales.map(s => s.productId)).size;

    return {
      totalRevenue,
      totalQuantity,
      averageOrderValue: sales.length > 0 ? totalRevenue / sales.length : 0,
      uniqueProducts
    };
  });

  readonly revenueByBrand = computed<ChartData>(() => {
    const sales = this.filteredSales();
    const brandRevenue: { [key: string]: number } = {};

    sales.forEach(sale => {
      brandRevenue[sale.brand] = (brandRevenue[sale.brand] || 0) + sale.revenue;
    });

    return {
      labels: Object.keys(brandRevenue),
      data: Object.values(brandRevenue)
    };
  });

  readonly revenueByCategory = computed<ChartData>(() => {
    const sales = this.filteredSales();
    const categoryRevenue: { [key: string]: number } = {};

    sales.forEach(sale => {
      categoryRevenue[sale.category] = (categoryRevenue[sale.category] || 0) + sale.revenue;
    });

    return {
      labels: Object.keys(categoryRevenue),
      data: Object.values(categoryRevenue)
    };
  });

  readonly dailyRevenue = computed<ChartData>(() => {
    const sales = this.filteredSales();
    const dailyData: { [key: string]: number } = {};

    sales.forEach(sale => {
      dailyData[sale.date] = (dailyData[sale.date] || 0) + sale.revenue;
    });

    const sortedDates = Object.keys(dailyData).sort();
    return {
      labels: sortedDates.map(date => {
        const d = new Date(date);
        return `${d.getMonth() + 1}/${d.getDate()}`;
      }),
      data: sortedDates.map(date => dailyData[date])
    };
  });

  readonly topProducts = computed(() => {
    const sales = this.filteredSales();
    const productRevenue: { [key: string]: number } = {};

    sales.forEach(sale => {
      productRevenue[sale.productName] = (productRevenue[sale.productName] || 0) + sale.revenue;
    });

    return Object.entries(productRevenue)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, revenue]) => ({ name, revenue }));
  });

  readonly activeFilters = computed<ActiveFilter[]>(() => {
    const filters = this.filters();
    const active: ActiveFilter[] = [];

    if (filters.brand) {
      active.push({ type: 'brand', value: filters.brand });
    }
    if (filters.category) {
      active.push({ type: 'category', value: filters.category });
    }
    if (filters.subcategory) {
      active.push({ type: 'subcategory', value: filters.subcategory });
    }
    if (filters.product) {
      active.push({ type: 'product', value: filters.product });
    }
    if (filters.retailer) {
      active.push({ type: 'retailer', value: filters.retailer });
    }
    if (filters.store) {
      const store = this.stores().find(s => s.id === filters.store);
      if (store) {
        active.push({ type: 'store', value: store.name });
      }
    }
    if (filters.dateRange.start || filters.dateRange.end) {
      let dateStr = '';
      if (filters.dateRange.start && filters.dateRange.end) {
        dateStr = `${filters.dateRange.start} to ${filters.dateRange.end}`;
      } else if (filters.dateRange.start) {
        dateStr = `From ${filters.dateRange.start}`;
      } else {
        dateStr = `Until ${filters.dateRange.end}`;
      }
      active.push({ type: 'dateRange', value: dateStr });
    }

    return active;
  });

  constructor(private mockDataService: MockDataService) {
    this.loadData();
  }

  loadData(): void {
    this.state.update(s => ({ ...s, loading: true }));

    setTimeout(() => {
      const mockData = this.mockDataService.generateMockData();
      this.state.update(s => ({
        ...s,
        salesData: mockData.salesData,
        stores: mockData.stores,
        products: mockData.products,
        loading: false
      }));
    }, 1000);
  }

  setFilter<K extends keyof SalesFilters>(key: K, value: SalesFilters[K]): void {
    if (value === 'null' || value === '') {
      value = null as SalesFilters[K];
    }
    const newFilters = { ...this.state().filters, [key]: value };

    if (key === 'brand') {
      if (value === null) {
        this.clearFilters();
        return;
      } else {
        if (newFilters.category) {
          const validCategories = this.products()
            .filter(p => p.brand === value)
            .map(p => p.category);
          if (!validCategories.includes(newFilters.category)) {
            newFilters.category = null;
            newFilters.subcategory = null;
            newFilters.product = null;
          }
        }
      }
    }


    if (key === 'category') {
      newFilters.subcategory = null;
      newFilters.product = null;

      if (newFilters.brand) {
        const validBrands = this.products()
          .filter(p => p.category === value)
          .map(p => p.brand);
        if (!validBrands.includes(newFilters.brand)) {
          newFilters.brand = null;
        }
      }
    }

    if (key === 'subcategory') {
      newFilters.product = null;
    }

    this.state.update(state => ({
      ...state,
      filters: newFilters
    }));
  }


  setDateRange(start: string | null, end: string | null): void {
    this.state.update(state => ({
      ...state,
      filters: {
        ...state.filters,
        dateRange: { start, end }
      }
    }));
  }

  clearFilters(): void {
    this.state.update(state => ({
      ...state,
      filters: {
        brand: null,
        category: null,
        subcategory: null,
        product: null,
        retailer: null,
        store: null,
        dateRange: { start: null, end: null }
      }
    }));
  }

  removeFilter(filterType: keyof SalesFilters | 'dateRange'): void {
    if (filterType === 'dateRange') {
      this.setDateRange(null, null);
    } else {
      this.setFilter(filterType, null);
    }
  }
}
