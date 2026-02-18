import {
  Component,
  ViewChildren,
  QueryList,
  AfterViewInit,
  OnDestroy,
  OnInit,
  ElementRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { DataService, EmploymentRecord } from '../../../core/services/data.service';
import { Subscription } from 'rxjs';
import { FilterService } from '../../../core/services/filter.service';

import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  BarController,
  BarElement
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  BarController,
  BarElement
);

@Component({
  selector: 'app-workforce',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './workforce.component.html',
  styleUrl: './workforce.component.scss'
})
export class WorkforceComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;
  private resizeObserver: ResizeObserver | null = null;
  private filterSub!: Subscription;

  constructor(
    private el: ElementRef,
    private dataService: DataService,
    private filterService: FilterService
  ) {}

  public records: EmploymentRecord[] = [];

  totalLayoffs = 0;
  totalCompanies = 0;
  avgLayoffsPerCompany = 0;
  highestLayoffYear: number | null = null;

  selectedYear: number | 'all' = 'all';

  public mainChartData: any = { labels: [], datasets: [] };
  public yoyChartData: any = { labels: [], datasets: [] };
  public companyChartData: any = { labels: [], datasets: [] };

  ngOnInit() {

    this.dataService.loadEmploymentData().subscribe(data => {

      this.records = data;

      this.computeDashboard();

      this.filterSub = this.filterService.year$.subscribe(year => {
        this.selectedYear = year;
        this.computeDashboard();
      });

    });
  }

  private computeDashboard() {

    if (!this.records.length) return;

    const filtered =
      this.selectedYear === 'all'
        ? this.records
        : this.records.filter(r => r.year === this.selectedYear);

    if (!filtered.length) return;

    this.totalLayoffs = filtered.reduce((s, r) => s + r.layoffs, 0);

    this.totalCompanies =
      new Set(filtered.map(r => r.company)).size;

    this.avgLayoffsPerCompany =
      this.totalCompanies
        ? Math.round(this.totalLayoffs / this.totalCompanies)
        : 0;

    if (this.selectedYear === 'all') {

      const yearlyMap = new Map<number, number>();

      this.records.forEach(r => {
        yearlyMap.set(
          r.year,
          (yearlyMap.get(r.year) || 0) + r.layoffs
        );
      });

      const sorted = Array.from(yearlyMap.entries())
        .sort((a, b) => b[1] - a[1]);

      this.highestLayoffYear = sorted.length ? sorted[0][0] : null;

    } else {
      this.highestLayoffYear = this.selectedYear as number;
    }

    const grouped = new Map<number, EmploymentRecord[]>();

    filtered.forEach(r => {
      if (!grouped.has(r.year)) grouped.set(r.year, []);
      grouped.get(r.year)!.push(r);
    });

    const years = Array.from(grouped.keys()).sort();

    const yearlyLayoffs: number[] = [];

    years.forEach(y => {
      const recs = grouped.get(y)!;
      yearlyLayoffs.push(
        recs.reduce((s, r) => s + r.layoffs, 0)
      );
    });

    this.mainChartData = {
      labels: years.map(y => y.toString()),
      datasets: [
        {
          label: 'Layoffs',
          data: yearlyLayoffs,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37,99,235,0.25)',
          tension: 0.4,
          fill: true,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: '#2563eb',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2
        }
      ]
    };

    if (years.length === 1) {
      const value = yearlyLayoffs[0];

      this.mainChartOptions = {
        ...this.mainChartOptions,
        scales: {
          y: {
            min: value * 0.9,
            max: value * 1.1
          }
        }
      };
    } else {
      this.mainChartOptions = {
        ...this.mainChartOptions,
        scales: {
          y: {
            beginAtZero: false
          }
        }
      };
    }

    const yoy: number[] = [];

    for (let i = 1; i < yearlyLayoffs.length; i++) {
      const growth =
        ((yearlyLayoffs[i] - yearlyLayoffs[i - 1])
          / yearlyLayoffs[i - 1]) * 100;

      yoy.push(Number(growth.toFixed(1)));
    }

    this.yoyChartData = {
      labels: years.slice(1).map(y => y.toString()),
      datasets: [
        {
          label: 'YoY Layoff Growth (%)',
          data: yoy,
          backgroundColor: '#10b981'
        }
      ]
    };

    const companyMap = new Map<string, number>();

    filtered.forEach(r => {
      companyMap.set(
        r.company,
        (companyMap.get(r.company) || 0) + r.layoffs
      );
    });

    const sortedCompanies = Array.from(companyMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    this.companyChartData = {
      labels: sortedCompanies.map(s => s[0]),
      datasets: [
        {
          label: 'Layoffs',
          data: sortedCompanies.map(s => s[1]),
          backgroundColor: '#8b5cf6'
        }
      ]
    };

    setTimeout(() => this.forceChartResize(), 100);
  }

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => {
      this.forceChartResize();
    });
    this.resizeObserver.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
    this.filterSub?.unsubscribe();
  }

  private forceChartResize() {
    if (!this.charts) return;
    this.charts.forEach(chart => {
      requestAnimationFrame(() => {
        chart.chart?.resize();
        chart.chart?.update();
      });
    });
  }

  public mainChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' as const } },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  public yoyChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  };

  public companyChartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  };
}
