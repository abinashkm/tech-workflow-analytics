import { Component } from '@angular/core';
import { ViewChildren, QueryList } from '@angular/core';
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
export class WorkforceComponent {

  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;

  public resizeCharts(): void {
    if (this.charts) {
      this.charts.forEach(chart => {
        chart.chart?.resize();
      });
    }
  }


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
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Layoffs'
        }
      },
      y1: {
        type: 'linear',
        position: 'right',
        grid: {
          drawOnChartArea: false
        },
        title: {
          display: true,
          text: 'Burnout Score'
        }
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
    }
  };

}
