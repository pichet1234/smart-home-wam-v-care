import { Routes } from "@angular/router";

export default [
    { path:'', redirectTo: '/dashboard', pathMatch:'full'},
    { 
        path:'green',
        loadComponent:()=> import('./green/green.component').then(c => c.GreenComponent)
    },
    {
        path:'mild',
        loadChildren: ()=> import('./mild/mild.component').then(c => c.MildComponent)
    },
    {
        path: 'moderate',
        loadChildren: ()=> import('./moderate/moderate.component').then(c => c.ModerateComponent)
    },
    {
        path: 'risk',
        loadChildren: ()=> import('./risk/risk.component').then(c => c.RiskComponent)
    }
] as Routes