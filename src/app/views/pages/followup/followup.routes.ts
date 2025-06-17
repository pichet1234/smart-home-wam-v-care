import { Routes } from "@angular/router";

export default [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: 'green',
    loadComponent: () => import('./green/green.component').then(c => c.GreenComponent)
  },
  {
    path: 'mild',
    loadComponent: () => import('./mild/mild.component').then(c => c.MildComponent)
  },
  {
    path: 'moderate',
    loadComponent: () => import('./moderate/moderate.component').then(c => c.ModerateComponent)
  },
  {
    path: 'risk',
    loadComponent: () => import('./risk/risk.component').then(c => c.RiskComponent)
  }
] as Routes;
