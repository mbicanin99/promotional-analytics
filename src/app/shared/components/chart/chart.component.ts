import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ChangeDetectorRef, AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { ChartData } from '../../../core/models/sale.model';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() title = '';
  @Input() type: ChartType = 'bar';
  @Input() data: ChartData = { labels: [], data: [] };
  @Input() height = 300;
  @Input() loading = false;

  private chart: Chart | null = null;
  private isViewInitialized = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.isViewInitialized = true;
    if (!this.loading && this.data.labels.length > 0) {
      setTimeout(() => {
        this.initChart();
      },0)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loading'] && !this.loading && this.isViewInitialized && !this.chart) {
      setTimeout(() => {
        this.initChart();
      },0)
    }

    if (changes['data'] && !changes['data'].firstChange && this.chart && !this.loading) {
      this.updateChart()
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private initChart(): void {
    if (!this.chartCanvas || !this.chartCanvas.nativeElement) {
      console.error("Chart canvas not available.")
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const config: ChartConfiguration = {
      type: this.type,
      data: {
        labels: this.data.labels,
        datasets: [{
          label: this.title,
          data: this.data.data,
          backgroundColor: this.getBackgroundColors(),
          borderColor: this.getBorderColors(),
          borderWidth: this.type === 'line' ? 2 : 1,
          tension: this.type === 'line' ? 0.4 : 0,
          fill: this.type === 'line'
        }]
      },
      options: this.getChartOptions()
    };

    try {
      this.chart = new Chart(ctx, config);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error creating chart', error);
    }
  }

  private updateChart(): void {
    if (!this.chart) {
      if(this.isViewInitialized && !this.loading) {
        this.initChart()
      }
      return;
    }

    this.chart.data.labels = this.data.labels;
    this.chart.data.datasets[0].data = this.data.data;
    this.chart.update();
  }

  private getBackgroundColors(): string | string[] {
    if (this.type === 'line') {
      return 'rgba(102, 126, 234, 0.1)';
    }

    const colors = [
      'rgba(102, 126, 234, 0.8)',
      'rgba(118, 75, 162, 0.8)',
      'rgba(239, 71, 111, 0.8)',
      'rgba(255, 209, 102, 0.8)',
      'rgba(6, 214, 160, 0.8)',
      'rgba(17, 138, 178, 0.8)'
    ];

    return this.type === 'doughnut' || this.type === 'pie'
      ? colors
      : colors[0];
  }

  private getBorderColors(): string | string[] {
    if (this.type === 'line') {
      return 'rgba(102, 126, 234, 1)';
    }

    const colors = [
      'rgba(102, 126, 234, 1)',
      'rgba(118, 75, 162, 1)',
      'rgba(239, 71, 111, 1)',
      'rgba(255, 209, 102, 1)',
      'rgba(6, 214, 160, 1)',
      'rgba(17, 138, 178, 1)'
    ];

    return this.type === 'doughnut' || this.type === 'pie'
      ? colors
      : colors[0];
  }

  private getChartOptions(): ChartConfiguration['options'] {
    const baseOptions: ChartConfiguration['options'] = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: this.type === 'doughnut' || this.type === 'pie',
          position: 'bottom'
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          cornerRadius: 8,
          titleFont: {
            size: 14,
            weight: 600
          },
          bodyFont: {
            size: 13
          },
          callbacks: {
            label: (context) => {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(context.parsed.y);
              }
              return label;
            }
          }
        }
      }
    };

    if (this.type !== 'doughnut' && this.type !== 'pie') {
      baseOptions.scales = {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(value as number);
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      };
    }

    return baseOptions;
  }

  exportChart(format: 'png' | 'csv'): void {
    if (!this.chart) return;

    if (format === 'png') {
      const url = this.chart.toBase64Image();
      const link = document.createElement('a');
      link.href = url;
      link.download = `${this.title.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.click();
    } else if (format === 'csv') {
      const csvContent = this.generateCSV();
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${this.title.replace(/\s+/g, '-').toLowerCase()}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
  }

  private generateCSV(): string {
    const headers = ['Label', 'Value'];
    const rows = this.data.labels.map((label, index) =>
      [label, this.data.data[index]]
    );

    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  }
}
