import { Component, ViewChild ,inject} from '@angular/core';
import { FormsModule , FormBuilder, FormGroup ,ReactiveFormsModule, Validators} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiDataService,Patient } from '../../../../core/services/api-data.service';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, DatatableComponent, NgxDatatableModule } from '@siemens/ngx-datatable';
import { ThaiDatePipe } from "../../../../core/pipes/thai-date.pipe";
import { CommonModule,DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-mild',
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
  templateUrl: './mild.component.html',
  styleUrl: './mild.component.scss'
})
export class MildComponent {
  rows: Patient[] = [];
  temp: Patient[] = [];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  reportForm: FormGroup;
  followForm: FormGroup;
  path:string = 'followups'
  selectedPatientName: string = '';

  currentDate: NgbDateStruct = inject(NgbCalendar).getToday();

  @ViewChild('table') table: DatatableComponent

  constructor( private fb: FormBuilder, private apidata:ApiDataService,private modalService: NgbModal){
    this.reportForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    });
    this.followForm = this.fb.group({
      pid:['', Validators.required],
      followUpDate: ['', Validators.required],
      followMethod: ['', Validators.required],
      followCount: [1, Validators.required],
      follower: ['', Validators.required],
      advice: [''],
      nextAppointment: [''],
      referHospital: [false],
      note: ['']
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
    this.apidata.getMild(startDate,endDate).subscribe({
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
    this.selectedPatientName = `${row.prefix}${row.fname} ${row.lname}`;
    this.modalService.open(content,{ size:'lg'});
  }
  onSendata(modal: any){
    if (this.followForm.valid) {
  const formData = this.followForm.value;
      this.apidata.sendData(this.path,formData).subscribe({
      next: () => {
        alert('บันทึกเรียบร้อย');
        modal.close();
        this.followForm.reset({ followCount: 1, referHospital: false }); // reset ค่า default
      },
      error: (err) => {
        console.error(err);
        alert('บันทึกล้มเหลว');
      }
    });
    }
  }
}
