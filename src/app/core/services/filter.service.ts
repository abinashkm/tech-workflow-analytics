// import { Injectable, signal } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class FilterService {

//   selectedYear = signal<number | null>(null);

//   setYear(year: number) {
//     this.selectedYear.set(year);
//   }

// }
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private yearSubject = new BehaviorSubject<number | 'all'>('all');

  year$ = this.yearSubject.asObservable();

  setYear(year: number | 'all') {
    this.yearSubject.next(year);
  }

}
