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
