import { Component , OnInit} from '@angular/core';
import { ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { LOCATION_DATA } from '../../../models/location-data';
import {GoogleMap, MapMarker} from '@angular/google-maps';
import { RouterModule, Router } from '@angular/router';
import { ApiDataService } from '../../../../core/services/api-data.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    GoogleMap,
    MapMarker,
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
center: google.maps.LatLngLiteral = { lat: 15.5082371, lng: 103.0542436 };
zoom = 15;
markerOptions: google.maps.MarkerOptions = { draggable: false };
markerPositions: google.maps.LatLngLiteral[] = [];
path:string = 'registerpatient'

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
  pid:string = '';
    constructor(private fb: FormBuilder , private apidataService: ApiDataService, private route: Router) {
    this.form = this.fb.group({
      cid:['',[Validators.required,Validators.minLength(13),Validators.maxLength(13)]],
      prefix:['',Validators.required],
      fname:['',Validators.required],
      lname:['',Validators.required],
      phone:[''],
      banumber:['',Validators.required],
      moo:['',Validators.required],
      province: ['',Validators.required],
      district: ['',Validators.required],
      subdistrict: ['',Validators.required],
      latitude: ['',Validators.required],
      longitude: ['',Validators.required]
    });
  }
    ngOnInit() {
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
    console.log(this.form.value);
   
    this.apidataService.sendData(this.path,this.form.value).subscribe({
      next: (response: any) => {
        if (response) {
          console.log(response.data);
          this.pid = response.data[0]._id;
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
