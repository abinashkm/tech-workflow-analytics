import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

import { ThemeService } from '../../core/services/theme.service';
import { FilterService } from '../../core/services/filter.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSelectModule,
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

  years: number[] = [];

  selectedYear: number | null = null;

  constructor(
    public themeService: ThemeService,
    private filterService: FilterService
  ) {
    // Generate years 2000–2026
    for (let i = 2000; i <= 2026; i++) {
      this.years.push(i);
    }
  }

  onYearChange(year: number) {
    this.filterService.setYear(year);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  isYearOpen = false;

  toggleYearDropdown() {
    this.isYearOpen = !this.isYearOpen;
  }

  selectYear(year: number) {
    this.selectedYear = year;
    this.filterService.setYear(year);
    this.isYearOpen = false;
  }


}
