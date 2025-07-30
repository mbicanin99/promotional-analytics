import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TrendDirection = 'up' | 'down' | 'neutral';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() trend?: string;
  @Input() trendDirection: TrendDirection = 'neutral';
  @Input() loading = false;
}
