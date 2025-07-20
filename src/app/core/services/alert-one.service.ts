import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertOneService {

  constructor() { }
  //for insert
  getInsert(succes:any){
    return Swal.fire({
      title:'Insert data successfull',
      text:succes,
      icon:'success',
    })
  }

  geterror(){
      return Swal.fire({
      title:'Insert Data Failed',
      text:'เกิดข้อผิดพลาด',
      icon:'warning',
    });
  }
  geterrorMessage(err:any){
    return Swal.fire({
      title:'ลงทะเบียนไม่สำเร็จ',
      text:err,
      icon:'warning',
    });
  }
  getUpdateSuccess(message: any) {
  return Swal.fire({
    title: 'Update Successful',
    text: message,
    icon: 'success',
  });
}

getDeleteConfirm() {
  return Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการลบข้อมูลนี้หรือไม่? การลบไม่สามารถย้อนกลับได้!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ลบ',
    cancelButtonText: 'ยกเลิก',
  });
}

}
