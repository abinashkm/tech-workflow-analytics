import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../app/layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'workforce',
        loadComponent: () =>
          import('../app/features/workforce/workforce/workforce.component')
            .then(m => m.WorkforceComponent)
      },
      {
        path: 'workforce/company/:name',
        loadComponent: () =>
          import('../app/features/workforce/company-detail/company-detail.component')
            .then(m => m.CompanyDetailComponent)
      },
      {
        path: 'burnout',
        loadComponent: () =>
          import('../app/features/burnout/burnout/burnout.component')
            .then(m => m.BurnoutComponent)
      },
      {
        path: 'companies',
        loadComponent: () =>
          import('./features/companies/companies.component')
            .then(m => m.CompaniesComponent)
      },
      {
        path: '',
        redirectTo: 'workforce',
        pathMatch: 'full'
      }
    ]
  }
];
