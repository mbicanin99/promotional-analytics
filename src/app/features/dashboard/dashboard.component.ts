import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesService } from '../../core/services/sales.service';
import { FiltersComponent } from './components/filters/filters.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { SharedModule } from '../../shared/shared.module'
import {NumberFormatPipe} from "../../shared/pipes/number-format.pipe";
import {CurrencyFormatPipe} from "../../shared/pipes/currency-format.pipe";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FiltersComponent,
    StatCardComponent,
    ChartComponent,
    SharedModule,
    NumberFormatPipe,
    CurrencyFormatPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  readonly salesService = inject(SalesService);

  readonly summary = this.salesService.summary;
  readonly revenueByBrand = this.salesService.revenueByBrand;
  readonly revenueByCategory = this.salesService.revenueByCategory;
  readonly dailyRevenue = this.salesService.dailyRevenue;
  readonly topProducts = this.salesService.topProducts;
  readonly loading = this.salesService.loading;

  readonly trends = {
    revenue: { value: '+12.5%', direction: 'up' as const },
    quantity: { value: '+8.3%', direction: 'up' as const },
    avgOrder: { value: '-2.1%', direction: 'down' as const },
    products: { value: '+5 new', direction: 'up' as const }
  };
}
