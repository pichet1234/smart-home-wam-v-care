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

@Component({
  selector: 'app-edit-patient',
  standalone: true,
  imports: [
    NgbDatepickerModule,
    ReactiveFormsModule,
    CommonModule,
    GoogleMap,
    MapMarker,
    RouterModule
  ],
  providers: [DatePipe,provideNgxMask()],
  templateUrl: './edit-patient.component.html',
  styleUrl: './edit-patient.component.scss'
})
export class EditPatientComponent {
  center: google.maps.LatLngLiteral = { lat: 15.5082371, lng: 103.0542436 }; //ตำบลบ้านยาง
  zoom = 15;
  markers: Array<{ position: google.maps.LatLngLiteral, label: string }> = [];

  path:string = 'registerpatient'

  form: FormGroup;
  provinces = LOCATION_DATA;
  districts: any[] = [];
  subdistricts: any[] = [];
  errorMessage:string =  '';
  pid:string = '';
  constructor(private fb: FormBuilder , private apidataService: ApiDataService, private route: Router , private activateroute: ActivatedRoute,private datePipe: DatePipe) {
    this.form = this.fb.group({
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

    if(pidFromUrl){
      this.apidataService.viewPatient(pidFromUrl).subscribe({
        next: (res)=>{
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
  if(this.form.controls['cid'].hasError('required')){
    this.errorMessage = 'กรุณากรอกข้อมูล';
  }
  this.form
  this.form.value.province?.name_th
  this.form.value.district?.name_th
  this.form.value.subdistrict?.name_th
 
  this.apidataService.sendData(this.path,this.form.value).subscribe({
    next: (response: any) => {
      if (response) {
        console.log(response.data);
        this.pid = response.data._id;
        // ทำงานต่อเมื่อ insert สำเร็จ เช่น ไปหน้าแบบประเมิน
        Swal.fire({
          title: 'ลงทะเบียนสำเร็จ',
          text: 'กด"ทำแบบคัดกรอง 2Q"',
          icon:'success',
          showCancelButton:true,
          confirmButtonText:'ทำแบบคัดกรอง 2Q',
          cancelButtonText: 'ปิด'
        }).then((result)=>{
          if(result.isConfirmed){
            //  ลิงก์ไปยังหน้าประเมิน 2Q
            this.route.navigate(['/assessment/assessment2q'],{queryParams:{pid:this.pid}});
          }
        });
      }
    },
    error: (error) => {
      console.error('เกิดข้อผิดพลาด:', error);
  
      if (error.error?.message) {
        const patientId = error.error.patientId;
        this.pid = patientId; //  สามารถนำไปใช้ต่อได้
        //  ใส่ error 'duplicate' ลงในฟอร์ม
        const currentErrors = this.form.controls['cid'].errors || {};
        this.form.controls['cid'].setErrors({
          ...currentErrors,
          duplicate: true
        });
        Swal.fire({
          title: 'ท่านเคยลงทะเบียนแล้ว',
          text: 'กรุณากดยืนยันเพื่อทำแบบคัดกรอง',
          showCancelButton:true,
          confirmButtonText:'ทำแบบคัดกรอง 2Q',
          cancelButtonText: 'ปิด'
        }).then((result)=>{
          if(result.isConfirmed){
            //  ลิงก์ไปยังหน้าประเมิน 2Q
            this.route.navigate(['/assessment/assessment2q'],{queryParams:{pid:this.pid}});
          }
        });
      }
    }
  });
}      
}
