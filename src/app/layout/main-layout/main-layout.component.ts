
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [  
     CommonModule, 
     RouterModule,
     SidebarComponent,
     HeaderComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

  isSidebarCollapsed = false; 

  toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
      
      window.dispatchEvent(new Event('resize'));

      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 310); 
    }
}