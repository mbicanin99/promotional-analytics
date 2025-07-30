import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-hamburger-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hamburger-toggle.component.html',
  styleUrl: './hamburger-toggle.component.scss'
})
export class HamburgerToggleComponent {
  @Input() isOpen = false;
  @Output() toggle = new EventEmitter<void>();
}
