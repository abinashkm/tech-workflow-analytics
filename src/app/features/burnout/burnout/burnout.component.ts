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
import { DataService, BurnoutRecord } from '../../../core/services/data.service';

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
  ArcElement,
  ScatterController,
  PieController,      
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
  ArcElement,
  ScatterController,
  PieController       
);

@Component({
  selector: 'app-burnout',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './burnout.component.html',
  styleUrl: './burnout.component.scss'
})
export class BurnoutComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;
  private resizeObserver!: ResizeObserver;

  constructor(
    private el: ElementRef,
    private dataService: DataService
  ) {}

  records: BurnoutRecord[] = [];

  avgBurnout = 0;
  highRiskPercent = 0;
  avgWorkHours = 0;
  avgSleepHours = 0;

  distributionData: any;
  workScatterData: any;
  sleepScatterData: any;
  fatigueIsolationData: any;
  riskPieData: any;

  ngOnInit() {
    this.dataService.loadBurnoutData().subscribe(data => {
      this.records = data;
      this.computeDashboard();
    });
  }

  private computeDashboard() {

    if (!this.records.length) return;

    const total = this.records.length;

    this.avgBurnout =
      this.records.reduce((s, r) => s + r.burnout_score, 0) / total;

    this.avgWorkHours =
      this.records.reduce((s, r) => s + r.work_hours, 0) / total;

    this.avgSleepHours =
      this.records.reduce((s, r) => s + r.sleep_hours, 0) / total;

    const highRiskCount =
      this.records.filter(r => r.burnout_risk.toLowerCase() === 'high').length;

    this.highRiskPercent = (highRiskCount / total) * 100;

    const buckets = ['0-20','20-40','40-60','60-80','80-100'];
    const counts = [0,0,0,0,0];

    this.records.forEach(r => {
      const index = Math.min(Math.floor(r.burnout_score / 20), 4);
      counts[index]++;
    });

    this.distributionData = {
      labels: buckets,
      datasets: [{
        label: 'Employees',
        data: counts,
        backgroundColor: '#ef4444'
      }]
    };

    this.workScatterData = {
      datasets: [{
        label: 'Work Hours vs Burnout',
        data: this.records.map(r => ({
          x: r.work_hours,
          y: r.burnout_score
        })),
        backgroundColor: '#3b82f6'
      }]
    };

    this.sleepScatterData = {
      datasets: [{
        label: 'Sleep Hours vs Burnout',
        data: this.records.map(r => ({
          x: r.sleep_hours,
          y: r.burnout_score
        })),
        backgroundColor: '#10b981'
      }]
    };

    const high = this.records.filter(r => r.burnout_risk.toLowerCase() === 'high');
    const low = this.records.filter(r => r.burnout_risk.toLowerCase() !== 'high');

    const avgFatigueHigh =
      high.reduce((s,r)=>s+r.fatigue_score,0) / high.length;

    const avgFatigueLow =
      low.reduce((s,r)=>s+r.fatigue_score,0) / low.length;

    const avgIsolationHigh =
      high.reduce((s,r)=>s+r.isolation_index,0) / high.length;

    const avgIsolationLow =
      low.reduce((s,r)=>s+r.isolation_index,0) / low.length;

    this.fatigueIsolationData = {
      labels: ['Fatigue','Isolation'],
      datasets: [
        {
          label: 'High Risk',
          data: [avgFatigueHigh, avgIsolationHigh],
          backgroundColor: '#f59e0b'
        },
        {
          label: 'Low/Medium Risk',
          data: [avgFatigueLow, avgIsolationLow],
          backgroundColor: '#8b5cf6'
        }
      ]
    };

    const riskCounts: any = { low:0, medium:0, high:0 };

    this.records.forEach(r => {
      riskCounts[r.burnout_risk.toLowerCase()]++;
    });

    this.riskPieData = {
      labels: ['Low','Medium','High'],
      datasets: [{
        data: [
          riskCounts.low,
          riskCounts.medium,
          riskCounts.high
        ],
        backgroundColor: ['#10b981','#f59e0b','#ef4444']
      }]
    };

    setTimeout(()=>this.forceResize(),100);
  }

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(()=>{
      this.forceResize();
    });
    this.resizeObserver.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  private forceResize() {
    if (!this.charts) return;
    this.charts.forEach(chart => {
      chart.chart?.resize();
      chart.chart?.update();
    });
  }

  chartOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' }
    }
  };
}
