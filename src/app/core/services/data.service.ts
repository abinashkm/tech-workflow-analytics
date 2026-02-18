import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import * as Papa from 'papaparse';

export interface EmploymentRecord {
  year: number;
  company: string;
  layoffs: number;
}
export interface BurnoutRecord {
  user_id: number;
  day_type: string;
  work_hours: number;
  screen_time_hours: number;
  meetings_count: number;
  breaks_taken: number;
  after_hours_work: number;
  app_switches: number;
  sleep_hours: number;
  task_completion: number;
  isolation_index: number;
  fatigue_score: number;
  burnout_score: number;
  burnout_risk: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}

  /* =============================
     EMPLOYMENT CSV
     public/tech_employment_2000_2025.csv
  ============================== */

  loadEmploymentData(): Observable<EmploymentRecord[]> {
    return this.http
      .get('/tech_employment_2000_2025.csv', { responseType: 'text' })
      .pipe(
        map(csv => {
          const parsed = Papa.parse(csv, {
            header: true,
            skipEmptyLines: true
          });

          return parsed.data.map((row: any) => ({
            year: +row.year,
            company: row.company,
            layoffs: +row.layoffs
          }));
        })
      );
  }

  /* =============================
     BURNOUT CSV
     public/employee_burnout.csv
  ============================== */

loadBurnoutData(): Observable<BurnoutRecord[]> {
  return this.http
    .get('/wfh_burnout_dataset.csv', { responseType: 'text' })
    .pipe(
      map(csv => {
        const parsed = Papa.parse(csv, {
          header: true,
          skipEmptyLines: true
        });

        return parsed.data.map((row: any) => ({
          user_id: +row.user_id,
          day_type: row.day_type,
          work_hours: +row.work_hours,
          screen_time_hours: +row.screen_time_hours,
          meetings_count: +row.meetings_count,
          breaks_taken: +row.breaks_taken,
          after_hours_work: +row.after_hours_work,
          app_switches: +row.app_switches,
          sleep_hours: +row.sleep_hours,
          task_completion: +row.task_completion,
          isolation_index: +row.isolation_index,
          fatigue_score: +row.fatigue_score,
          burnout_score: +row.burnout_score,
          burnout_risk: row.burnout_risk
        }));
      })
    );
 }

}
