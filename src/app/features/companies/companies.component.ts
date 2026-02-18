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
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { DataService, EmploymentRecord } from '../../core/services/data.service';

import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  BarController,
  BarElement,
  PieController,
  ArcElement
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  BarController,
  BarElement,
  PieController,
  ArcElement
);

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;
  private resizeObserver: ResizeObserver | null = null;

  constructor(
    private el: ElementRef,
    private dataService: DataService
  ) {}

  records: EmploymentRecord[] = [];

  totalCompanies = 0;
  totalLayoffs = 0;
  avgLayoffsPerCompany = 0;
  mostImpactedCompany = '';

  selectedCompany = '';
  companyList: string[] = [];

  topCompaniesData: any = { labels: [], datasets: [] };
  companyTrendData: any = { labels: [], datasets: [] };
  companyShareData: any = { labels: [], datasets: [] };

  ngOnInit() {
    this.dataService.loadEmploymentData().subscribe(data => {
      this.records = data;
      this.computeDashboard();
    });
  }

  private computeDashboard() {

    if (!this.records.length) return;

    const companyMap = new Map<string, number>();

    this.records.forEach(r => {
      companyMap.set(
        r.company,
        (companyMap.get(r.company) || 0) + r.layoffs
      );
    });

    this.totalCompanies = companyMap.size;
    this.totalLayoffs = Array.from(companyMap.values())
      .reduce((a, b) => a + b, 0);

    this.avgLayoffsPerCompany =
      Math.round(this.totalLayoffs / this.totalCompanies);

    const sorted = Array.from(companyMap.entries())
      .sort((a, b) => b[1] - a[1]);

    this.mostImpactedCompany = sorted[0][0];

    this.companyList = sorted.map(s => s[0]);
    this.selectedCompany = this.companyList[0];

    const top10 = sorted.slice(0, 10);

    this.topCompaniesData = {
      labels: top10.map(t => t[0]),
      datasets: [{
        label: 'Layoffs',
        data: top10.map(t => t[1]),
        backgroundColor: '#3b82f6'
      }]
    };

    const top5 = sorted.slice(0, 5);

    this.companyShareData = {
      labels: top5.map(t => t[0]),
      datasets: [{
        data: top5.map(t => t[1]),
        backgroundColor: [
          '#ef4444',
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#8b5cf6'
        ]
      }]
    };

    this.updateCompanyTrend();

    setTimeout(() => this.forceResize(), 100);
  }

  updateCompanyTrend() {

    const companyData = this.records
      .filter(r => r.company === this.selectedCompany);

    const yearlyMap = new Map<number, number>();

    companyData.forEach(r => {
      yearlyMap.set(
        r.year,
        (yearlyMap.get(r.year) || 0) + r.layoffs
      );
    });

    const sortedYears = Array.from(yearlyMap.entries())
      .sort((a, b) => a[0] - b[0]);

    this.companyTrendData = {
      labels: sortedYears.map(s => s[0]),
      datasets: [{
        label: this.selectedCompany,
        data: sortedYears.map(s => s[1]),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.2)',
        tension: 0.4,
        fill: true
      }]
    };

    setTimeout(() => this.forceResize(), 100);
  }

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => {
      this.forceResize();
    });
    this.resizeObserver.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  private forceResize() {
    this.charts?.forEach(chart => {
      chart.chart?.resize();
      chart.chart?.update();
    });
  }

  chartOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' as const } }
  };
}
