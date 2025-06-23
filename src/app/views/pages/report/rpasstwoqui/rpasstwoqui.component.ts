import { Component, ViewChild ,inject } from '@angular/core';
import { FormsModule , FormBuilder, FormGroup ,ReactiveFormsModule} from '@angular/forms';
import { RouterLink,Router } from '@angular/router';
import { ApiDataService,Patient } from '../../../../core/services/api-data.service';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, DatatableComponent, NgxDatatableModule } from '@siemens/ngx-datatable';
import { ThaiDatePipe } from "../../../../core/pipes/thai-date.pipe";
import { CommonModule,DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-rpasstwoqui',
  standalone: true,
  imports: [
    RouterLink,
    NgxDatatableModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    ThaiDatePipe,
    CommonModule
  ],
  providers: [DatePipe],
  templateUrl: './rpasstwoqui.component.html',
  styleUrl: './rpasstwoqui.component.scss'
})
export class RpasstwoquiComponent {
  rows: Patient[] = [];
  temp: Patient[] = [];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  reportForm: FormGroup;
  followForm: FormGroup;
  path:string = 'asfollow'
  selectedPatientName: string = '';
  modalRef: any; // NgbModalRef
 currentDate: NgbDateStruct = inject(NgbCalendar).getToday();
 @ViewChild('table') table: DatatableComponent
  constructor( private fb: FormBuilder,public  modalService: NgbModal, private apidata:ApiDataService,private router:Router){
    this.reportForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    });

    
  }
  convertNgbDateToString(date: any): string {
    const y = date.year;
    const m = String(date.month).padStart(2, '0');
    const d = String(date.day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  onSubmit(){
    const startDate = this.convertNgbDateToString(this.reportForm.value.startDate);
    const endDate  = this.convertNgbDateToString(this.reportForm.value.endDate);
    this.apidata.assTwoq(startDate,endDate).subscribe({
      next: (data: Patient[]) => {
        this.temp = [...data];    // backup สำหรับ filter
        this.rows = data;         // แสดงข้อมูลในตาราง

        this.loadingIndicator = false;
      },
      error: (err) => {
        console.error('เกิดข้อผิดพลาด:', err);
      }
    });
  }
  updateFilter(event: KeyboardEvent) {
    const val = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    
    // filter our data
    const temp = this.temp.filter(function(d: any) {
      return (
      d.fname.toLowerCase().includes(val) ||
      d.lname.toLowerCase().includes(val) ||
      !val
    );
    });

    // update the rows
    this.rows = temp;

    // whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  onClickfollow(row: any,content:any){
    this.followForm.patchValue({
    pid: row._id
    })
    this.selectedPatientName = `${row.prefix}${row.fname} ${row.lname}`;
    this.modalRef = this.modalService.open(content, { size: 'lg' });
  }
  onSendata(modal: any){
    console.log(this.followForm.value)
    if (this.followForm.valid) {
  const formData = this.followForm.value;
      this.apidata.sendData(this.path,formData).subscribe({
      next: (respone) => {
        if(respone){
                Swal.fire({
                  title: 'บันทึกการติดตามสำเร็จ',
                  text: 'ทำแบบประเมินรอบถัดไป',
                  icon: 'success',
                  showCancelButton: true,
                  confirmButtonText: 'ไปทำแบบประเมิน 9Q',
                  cancelButtonText: 'ปิด'
                }).then((result) => {
                  if (result.isConfirmed) {
                    // ปิด Modal
                  if (this.modalRef) {
                        this.modalRef.close();
                    }
                    // ลิงก์ไปยังหน้าประเมิน 9Q
                    this.router.navigate(['/followup/assessment9q'], { queryParams: { pid: this.followForm.get('pid')?.value } });
                  }
              });
        }
      },
      error: (err) => {
        console.error(err);
        alert('บันทึกล้มเหลว');
      }
    });
    }
  } 

//export to file excel
  exportExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.rows); // ใช้ข้อมูลที่แสดงอยู่ในตาราง
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '2Q Assessed');
  
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
  
    FileSaver.saveAs(data, '2q-assessed.xlsx');
  }
  
}
