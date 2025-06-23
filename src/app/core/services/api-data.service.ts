import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';

export interface Patient {
  cid: string;
  prefix: string;
  fname: string;
  lname: string;
  phone: string;
  address: {
    bannumber: string;
    moo: string;
    subdistrict: string;
    district: string;
    province: string;
  };
  latitude: string;
  longitude: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  urlServe = "https://backend-project-m79o.onrender.com";
  constructor(private http: HttpClient) { }

  sendData(path:string,data:any):Observable<any>{
    return this.http.post(`${this.urlServe}/${path}`, data);
  }

  getPatient(): Observable<Patient[]>{
  return this.http.get<Patient[]>(this.urlServe+'/getpatient')
}
  getNotass(): Observable<any>{
    return this.http.get(this.urlServe+'/notas2q');
  }

  getCountPatient(): Observable<any> {
    return this.http.get(this.urlServe+'/countpatient');
  }
  getcountmildAs(): Observable<any> {
    return this.http.get(this.urlServe+'/getcountmild');
  }
  getcountgreen(): Observable<any> {
    return this.http.get(this.urlServe+'/getcountgreen');
  }
  getcountred():Observable<any> {
    return this.http.get(this.urlServe+'/countred');
  }
  getcountmoderate(): Observable<any> {
    return this.http.get(this.urlServe+'/countmoderate');
  }
  //ติดตามคัดกรองซ้ำ ดึงจากวันที่คัดกรอง
  getMild(startDate: string, endDate: string): Observable<any> {
    return this.http.post<any>(`${this.urlServe}/getpatientmild`, { startDate,endDate });
  }
  //ติดตามคัดกรองซ้ำ กลุ่มเสี่ยงปานกลาง
 getModerate(startDate: string, endDate: string): Observable<any>{
   return this.http.post<any>(`${this.urlServe}/getmoderate`,{ startDate, endDate });
 }
 //ติดตามคัดกรองซ้ำ กลุ่มเสี่ยงรุ่แรง
 getRed(startDate: string, endDate: string): Observable<any>{
    return this.http.post<any>(`${this.urlServe}/getred`,{ startDate, endDate });
 }
}
