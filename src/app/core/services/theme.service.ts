import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  isDarkMode = signal<boolean>(false);

  constructor() {
    this.initializeTheme();

    // Automatically react when signal changes
    effect(() => {
      const body = document.body;

      if (this.isDarkMode()) {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  toggleTheme() {
    this.isDarkMode.update(value => !value);
  }

  private initializeTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      this.isDarkMode.set(true);
    }
  }
}
