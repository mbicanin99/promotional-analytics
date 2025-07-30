import {Component, Input} from '@angular/core';
import {SidebarItemComponent} from "../sidebar-item/sidebar-item.component";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-sidebar-content',
  standalone: true,
  imports: [
    SidebarItemComponent,
    CommonModule
  ],
  templateUrl: './sidebar-content.component.html',
  styleUrl: './sidebar-content.component.scss'
})
export class SidebarContentComponent {
  @Input() navSections!: { title: string; items: { label: string; icon: string; route?: string }[] }[];
}
