import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LOCATION_DATA } from '../../../models/location-data';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { RouterModule } from '@angular/router';
import { ApiDataService } from '../../../../core/services/api-data.service';
import { AlertOneService } from '../../../../core/services/alert-one.service';

@Component({
  selector: 'app-registertwo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    GoogleMap,
    MapMarker,
    RouterModule,
  ],
  templateUrl: './registertwo.component.html',
  styleUrl: './registertwo.component.scss'
})
export class RegistertwoComponent {
  center: google.maps.LatLngLiteral = { lat: 15.5082371, lng: 103.0542436 };
  zoom = 15;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];
  path: string = 'registerpatient'

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
  errorMessage: string = '';
  constructor(private fb: FormBuilder, private apidataService: ApiDataService,private alertone:AlertOneService) {
    this.form = this.fb.group({
      cid: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      prefix: ['', Validators.required],
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      phone: [''],
      banumber: ['', Validators.required],
      moo: ['', Validators.required],
      province: ['', Validators.required],
      district: ['', Validators.required],
      subdistrict: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required]
    });
  }
  ngOnInit() {
    this.setCurrentLocation();
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

  setCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const currentLatLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.center = currentLatLng;
        this.markerPositions = [currentLatLng];
        this.form.patchValue({
          latitude: currentLatLng.lat,
          longitude: currentLatLng.lng
        });
      }, error => {
        console.error('ไม่สามารถรับตำแหน่งปัจจุบันได้:', error);
      });
    } else {
      console.warn('Browser ไม่รองรับ Geolocation');
    }
  }

    onSubmit(){
    if(this.form.controls['cid'].hasError('required')){
      this.errorMessage = 'กรุณากรอกข้อมูล';
    }
    this.form.value.province?.name_th
    this.form.value.district?.name_th
    this.form.value.subdistrict?.name_th
    console.log(this.form.value);
   
    this.apidataService.sendData(this.path,this.form.value).subscribe((respone:any)=>{
       if(respone){
        //รับ respone 
        this.alertone.getInsert(respone.message);
        this.form.reset();
        }else{
          this.alertone.geterror();
        }
      }, (err) => {
        console.error('เกิดข้อผิดพลาด:', err.message);
        if(err.error && err.error.message){
          this.alertone.geterrorMessage(err.error.message)
          this.form.reset();
         }else{
          
         }
      });
  }
}
