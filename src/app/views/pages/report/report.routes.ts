import { Routes } from "@angular/router";

export default [
    { path: '', redirectTo: 'profile', pathMatch: 'full' },
    {
        path:'risk',
        loadComponent: () => import('./risk/risk.component').then(c => c.RiskComponent)
    },
    {
        path:'moderate',
        loadComponent: () => import('./moderate/moderate.component').then(c => c.ModerateComponent)
    },
    {
        path: 'mild',
        loadComponent: () => import('./mild/mild.component').then(c => c.MildComponent)
    },
    {
        path: 'green',
        loadComponent: () =>import('./green/green.component').then(c => c.GreenComponent)
    },
    {
        path: 'rpasstwoqui',
        loadComponent: () =>import('./rpasstwoqui/rpasstwoqui.component').then(c => c.RpasstwoquiComponent)
    }
] as Routes