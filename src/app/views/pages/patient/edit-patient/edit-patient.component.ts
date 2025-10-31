import { Component } from '@angular/core';
import {  NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule,DatePipe  } from '@angular/common'; 
import { LOCATION_DATA } from '../../../models/location-data';
import {GoogleMap, MapMarker} from '@angular/google-maps';
import { RouterModule, ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ApiDataService } from '../../../../core/services/api-data.service';
import Swal from 'sweetalert2';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AlertOneService } from '../../../../core/services/alert-one.service';
import { AgePipe } from '../../../../core/pipes/age.pipe';

@Component({
  selector: 'app-edit-patient',
  standalone: true,
  imports: [
    NgbDatepickerModule,
    ReactiveFormsModule,
    CommonModule,
    GoogleMap,
    MapMarker,
    RouterModule,
    AgePipe
  ],
  providers: [DatePipe,provideNgxMask()],
  templateUrl: './edit-patient.component.html',
  styleUrl: './edit-patient.component.scss'
})
export class EditPatientComponent {
  center: google.maps.LatLngLiteral = { lat: 15.5082371, lng: 103.0542436 }; //ตำบลบ้านยาง
  zoom = 15;
  markers: Array<{ position: google.maps.LatLngLiteral, label: string }> = [];
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];
  path:string = 'editpatient'

  addMarker(event: google.maps.MapMouseEvent) {
  if (event.latLng) {
    const latLng = event.latLng.toJSON();
    this.markerPositions = [latLng]; // ให้มีแค่ marker เดียว (ล่าสุด)
    this.form.patchValue({
        latitude: latLng.lat,
        longitude: latLng.lng
      });
  }
}
  form: FormGroup;
  provinces = LOCATION_DATA;
  districts: any[] = [];
  subdistricts: any[] = [];
  errorMessage:string =  '';
  pid: string | null = null; 
  constructor(
    private fb: FormBuilder ,
    private apidataService: ApiDataService,
    private route: Router , 
    private activateroute: ActivatedRoute,
    private datePipe: DatePipe,
    private alertone: AlertOneService) {
    this.form = this.fb.group({
      pid:[''],
      cid:[''],
      prefix:[''],
      fname:[''],
      lname:[''],
      birthday:[''],  
      phone:[''],
      banumber:[''],
      moo:[''],
      province: [''],
      district: [''],
      subdistrict: [''],
      latitude: [''],
      longitude: ['']
    });
  }

  ngOnInit() {
  this.activateroute.queryParamMap.subscribe((param: ParamMap)=>{
    const pidFromUrl = param.get('pid');
    this.pid = pidFromUrl
    if(pidFromUrl){
      this.apidataService.viewPatient(pidFromUrl).subscribe({
        next: (res)=>{
              const formattedBirthday = this.datePipe.transform(res.birthday, 'dd/MM/yyyy');

              // 1. หาจังหวัดที่ตรงกับชื่อที่อยู่
              const matchedProvince = this.provinces.find(p => p.name_th === res.address.province);
              const matchedDistrict = matchedProvince?.amphure.find(d => d.name_th === res.address.district);
              const matchedSubdistrict = matchedDistrict?.tambon.find(t => t.name_th === res.address.subdistrict);

              // 2. ตั้งค่ารายการอำเภอ/ตำบลที่ต้องใช้ใน dropdown
              this.districts = matchedProvince?.amphure || [];
              this.subdistricts = matchedDistrict?.tambon || [];

              // 3. ใส่ค่าลงใน form
              this.form.patchValue({
                pid:res._id,
                cid: res.cid,
                prefix: res.prefix,
                fname: res.fname,
                lname: res.lname,
                banumber: res.address.bannumber,
                moo: res.address.moo,
                province: matchedProvince || null,
                district: matchedDistrict || null,
                subdistrict: matchedSubdistrict || null,
                birthday: formattedBirthday,
                phone: res.phone,
                latitude: res.latitude,
                longitude: res.longitude
              });
          if (res.latitude && res.longitude) {
              const lat = parseFloat(res.latitude);
              const lng = parseFloat(res.longitude);
              this.center = { lat, lng };
              this.markerPositions = [{ lat, lng }]; // <== ใช้ markerPositions
            
          // ✅ เพิ่ม marker
          this.markers = [
            {
              position: this.center,
              label: `${res.fname} ${res.lname}`
            }
          ];
          }
        },
        error:(err)=>{
          console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ป่วย', err);        
        }
      })
    }
  });

    //ส่วนเลือกจังหวัด อำเภอ
this.form.get('province')?.valueChanges.subscribe(province => {
  this.districts = province ? province.amphure : [];
  this.subdistricts = [];
  this.form.get('district')?.reset();
  this.form.get('subdistrict')?.reset();
});

  //ส่วนเลือกจังหวัด
this.form.get('district')?.valueChanges.subscribe(district => {
  this.subdistricts = district ? district.tambon : [];
  this.form.get('subdistrict')?.reset();
});
}
onSubmit(){
    this.apidataService.sendData(this.path,this.form.value).subscribe({
      next: (response: any) => {
        if (response) {
          Swal.fire({
            title: 'แก้ไขข้อมูลสำเร็จ',
            text: 'update data',
            icon:'success',
            showCancelButton:true,
            confirmButtonText:'ตกลง',
            cancelButtonText: 'ปิด'
          }).then((result)=>{
            if(result.isConfirmed){
             // this.route.navigate(['/assessment/assessment2q'],{queryParams:{pid:this.pid}});
            }
          });
        }
      },
      error: (error) => {
        console.error('เกิดข้อผิดพลาด:', error);
      }
    });
  } 
  //ลบ patient
  delectPatient(){
    Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการลบข้อมูลนี้หรือไม่? การลบไม่สามารถย้อนกลับได้!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ลบ',
    cancelButtonText: 'ยกเลิก',
    }).then((result)=>{
    if(result.isConfirmed){
      this.apidataService.sendData('deletepat',this.form.value).subscribe({
        next: (response: any) => {
          if (response) {
            Swal.fire({
              title: 'DELETE DATA',
              text: 'คุณได้ลบข้อมูลเรียบร้อยแล้ว',
              icon:'success',
              showCancelButton:true,
              confirmButtonText:'ตกลง',
              cancelButtonText: 'ปิด'
            }).then((result)=>{
              if(result.isConfirmed){
               this.route.navigate(['/patient/patient']);
              }
            });
          }
        },
        error: (error) => {
          console.error('เกิดข้อผิดพลาด:', error);
        }
        });
    }
    });
  }
}
