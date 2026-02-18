import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ThemeService } from '../../core/services/theme.service';
import { FilterService } from '../../core/services/filter.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  appTitle = 'Tech Workforce Analytics';
  subtitle = 'Workforce Trends & Burnout Insights (2000 – 2026)';

  @Output() menuClick = new EventEmitter<void>();

  years: number[] = [];
  selectedYear: number | 'all' = 'all';

  constructor(
    private router : Router,
    public themeService: ThemeService,
    private filterService: FilterService
  ) {
    for (let i = 2000; i <= 2026; i++) {
      this.years.push(i);
    }
  }

  showYearSelector(): boolean {
    return !this.router.url.includes('burnout');
  }

  selectYear(year: number | 'all') {
    this.selectedYear = year;
    this.filterService.setYear(year);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  isYearOpen = false;

  toggleYearDropdown() {
    this.isYearOpen = !this.isYearOpen;
  }
}
