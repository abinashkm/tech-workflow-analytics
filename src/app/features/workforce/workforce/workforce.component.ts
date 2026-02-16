import { Component, ViewChildren, QueryList, AfterViewInit, OnDestroy, ElementRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';

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
  imports: [
    CommonModule,
    BaseChartDirective
  ],
  templateUrl: './workforce.component.html',
  styleUrl: './workforce.component.scss'
})
export class WorkforceComponent  implements AfterViewInit, OnDestroy {

@ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;
  private resizeObserver: ResizeObserver | null = null;

  constructor(private el: ElementRef) {} // Inject ElementRef to watch this component

  ngAfterViewInit() {
    // This watches the physical size of the dashboard container
    this.resizeObserver = new ResizeObserver(() => {
      this.forceChartResize();
    });
    
    this.resizeObserver.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    // Stop watching when user leaves the page
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private forceChartResize() {
    if (this.charts) {
      this.charts.forEach(chart => {
        // requestAnimationFrame ensures the resize happens 
        // after the browser calculates the new layout width
        requestAnimationFrame(() => {
          chart.chart?.resize();
          chart.chart?.update();
        });
      });
    }
  }

  public baseChartOptions = {
      color: '#e5e7eb'
  };


  /* ================= MAIN MULTI-AXIS LINE CHART ================= */

  public mainChartData = {
    labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'Layoffs',
        data: [1200, 1800, 3200, 2900, 4100, 3800],
        yAxisID: 'y',
        tension: 0.4
      },
      {
        label: 'Burnout Score',
        data: [45, 52, 60, 72, 68, 74],
        yAxisID: 'y1',
        tension: 0.4
      }
    ]
  };

  public mainChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top' as const
      }
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      },
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      }
    }

  };

  /* ================= YoY GROWTH BAR CHART ================= */

  public yoyChartData = {
    labels: ['2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'YoY Layoff Growth (%)',
        data: [20, 78, -9, 41, -7]
      }
    ]
  };

  public yoyChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      },
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      }
    }

  };

  /* ================= TOP COMPANIES HORIZONTAL BAR ================= */

  public companyChartData = {
    labels: ['Company A', 'Company B', 'Company C', 'Company D'],
    datasets: [
      {
        label: 'Layoffs',
        data: [800, 650, 540, 420]
      }
    ]
  };

  public companyChartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      },
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      }
    }

  };

}
