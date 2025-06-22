import { Routes } from "@angular/router";

export default [
  { path: '', redirectTo: 'followup', pathMatch: 'full' },
  {
    path: 'followup',
    loadComponent: () => import('./followup.component').then(c=>c.FollowupComponent)
  },
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
  },
  {
    path: 'assessment9q',
    loadComponent: () => import('./assessment9q/assessment9q.component').then(c => c.Assessment9qComponent)
  }
] as Routes;
