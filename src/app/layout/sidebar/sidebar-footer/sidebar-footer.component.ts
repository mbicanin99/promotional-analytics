import {Component, Input} from '@angular/core';
import {SidebarItemComponent} from "../sidebar-item/sidebar-item.component";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-sidebar-footer',
  standalone: true,
  imports: [
    SidebarItemComponent,
    CommonModule
  ],
  templateUrl: './sidebar-footer.component.html',
  styleUrl: './sidebar-footer.component.scss'
})
export class SidebarFooterComponent {
  @Input() navFooterSections!: { title: string; icon: string }[];
}
