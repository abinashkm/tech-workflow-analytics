import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import * as Papa from 'papaparse';

export interface EmploymentRecord {
  year: number;
  company: string;
  layoffs: number;
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
}
