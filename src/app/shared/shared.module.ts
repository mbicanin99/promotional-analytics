import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatCardComponent } from './components/stat-card/stat-card.component';
import { ChartComponent } from './components/chart/chart.component';
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
import { NumberFormatPipe } from './pipes/number-format.pipe';

const components = [
  StatCardComponent,
  ChartComponent
];

const pipes = [
  CurrencyFormatPipe,
  NumberFormatPipe
];

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule
  ]
})
export class SharedModule { }
