import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../../../core/services/sales.service';
import { Store } from '../../../../core/models/store.model';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {
  protected salesService = inject(SalesService);

  filters = this.salesService.filters;
  brands = this.salesService.brands;
  categories = this.salesService.categories;
  retailers = this.salesService.retailers;
  stores = this.salesService.stores;
  activeFilters = this.salesService.activeFilters;

  getFilteredStores(): Store[] {
    const retailer = this.filters().retailer;
    const allStores = this.stores();

    if (retailer) {
      return allStores.filter(store => store.retailer === retailer);
    }
    return allStores;
  }

  updateDateRange(value: string | null, type: 'start' | 'end'): void {
    const currentRange = this.filters().dateRange;
    if (type === 'start') {
      this.salesService.setDateRange(value, currentRange.end);
    } else {
      this.salesService.setDateRange(currentRange.start, value);
    }
  }

  clearAllFilters(): void {
    this.salesService.clearFilters();
  }

  removeFilter(filterType: string): void {
    this.salesService.removeFilter(filterType as any);
  }
}
