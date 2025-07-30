import {Component, Input} from '@angular/core';
import {CommonModule, NgIf} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-sidebar-item',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    RouterLinkActive,
    CommonModule
  ],
  templateUrl: './sidebar-item.component.html',
  styleUrl: './sidebar-item.component.scss'
})
export class SidebarItemComponent {
  @Input() label!: string;
  @Input() icon!: string;
  @Input() route?: string;
}
