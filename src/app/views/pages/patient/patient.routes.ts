import { Routes } from "@angular/router";

export default[
    { path: '', redirectTo: 'patient', pathMatch: 'full'},
    {
        path: 'patient',
        loadComponent: () =>import('./patient/patient.component').then(c => c.PatientComponent)
    },
    {
        path: 'edit-patient',
        loadComponent: () => import('./edit-patient/edit-patient.component').then(c => c.EditPatientComponent) 
    }
] as Routes