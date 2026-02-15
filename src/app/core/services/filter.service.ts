import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  selectedYear = signal<number | null>(null);

  setYear(year: number) {
    this.selectedYear.set(year);
  }

}
