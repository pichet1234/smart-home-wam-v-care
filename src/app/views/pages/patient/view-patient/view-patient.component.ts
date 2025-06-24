import { Component } from '@angular/core';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { LOCATION_DATA } from '../../../models/location-data';
import { GoogleMap, MapMarker, GoogleMapsModule } from '@angular/google-maps';
import { RouterModule, ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ApiDataService } from '../../../../core/services/api-data.service';
import Swal from 'sweetalert2';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-view-patient',
  standalone: true,
  imports: [
    NgbDatepickerModule,
    ReactiveFormsModule,
    CommonModule,
    GoogleMapsModule,
    GoogleMap,
    MapMarker,
    RouterModule
  ],
  providers: [DatePipe],
  templateUrl: './view-patient.component.html',
  styleUrl: './view-patient.component.scss'
})
export class ViewPatientComponent {
  center: google.maps.LatLngLiteral = { lat: 15.5082371, lng: 103.0542436 }; //ตำบลบ้านยาง
  zoom = 15;
  markers: Array<{ position: google.maps.LatLngLiteral, label: string }> = [];



  form: FormGroup;
  patientData: any;
  constructor(
     private apidata: ApiDataService,
     private route: ActivatedRoute, 
     private fb: FormBuilder,
     private datePipe: DatePipe) {
    
    this.form = this.fb.group({
      cid: [''],
      prefix: [''],
      fname: [''],
      lname: [''],
      birthday: [''],
      phone: [''],
      bannumber: [''],
      moo: [''],
      province: [''],
      district: [''],
      subdistrict: [''],
      latitude: [''],
      longitude: ['']
    });
  }
  ngOnInit() {
    this.route.queryParamMap.subscribe((param: ParamMap) => {
      const pidFromUrl = param.get('pid');

      if (pidFromUrl) {
        this.apidata.viewPatient(pidFromUrl).subscribe({
          next: (res) => {
            const formattedBirthday = this.datePipe.transform(res.birthday, 'dd/MM/yyyy');
            this.form.patchValue({
              cid: res.cid,
              prefix: res.prefix,
              fname: res.fname,
              lname: res.lname,
              bannumber: res.address.bannumber,
              moo: res.address.moo,
              province: res.address.province,
              district: res.address.district,
              subdistrict: res.address.subdistrict,
              birthday: formattedBirthday,
              phone: res.phone,
              latitude: res.latitude,
              longitude: res.longitude
            })
            if (res.latitude && res.longitude) {
              this.center = {
                lat: parseFloat(res.latitude),
                lng: parseFloat(res.longitude)
              };
              
            // ✅ เพิ่ม marker
            this.markers = [
              {
                position: this.center,
                label: `${res.fname} ${res.lname}`
              }
            ];
            }
          },
          error: (err) => {
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ป่วย', err);
          }
        });
      }
    });
  }
}
