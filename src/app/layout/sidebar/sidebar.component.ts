import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {NAV_SECTIONS, SIDEBAR_FOOTER_TABS} from "../../shared/constants/constants";
import {SidebarItemComponent} from "./sidebar-item/sidebar-item.component";
import {SidebarFooterComponent} from "./sidebar-footer/sidebar-footer.component";
import {SidebarContentComponent} from "./sidebar-content/sidebar-content.component";

interface NavItem {
  label: string;
  icon: string;
  route: string;
  active?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarItemComponent, SidebarFooterComponent, SidebarContentComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() isOpen = true;
  protected readonly navSections = NAV_SECTIONS;
  protected readonly navFooterSections = SIDEBAR_FOOTER_TABS;
}
