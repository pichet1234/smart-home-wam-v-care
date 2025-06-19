import { Component , ViewChild ,inject} from '@angular/core';
import { FormsModule , FormBuilder, FormGroup ,ReactiveFormsModule} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiDataService,Patient } from '../../../../core/services/api-data.service';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, DatatableComponent, NgxDatatableModule } from '@siemens/ngx-datatable';
import { ThaiDatePipe } from "../../../../core/pipes/thai-date.pipe";
import { CommonModule,DatePipe } from '@angular/common';
@Component({
  selector: 'app-risk',
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
  templateUrl: './risk.component.html',
  styleUrl: './risk.component.scss'
})
export class RiskComponent {
  rows: Patient[] = [];
  temp: Patient[] = [];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  reportForm: FormGroup;

 currentDate: NgbDateStruct = inject(NgbCalendar).getToday();
 @ViewChild('table') table: DatatableComponent
  constructor( private fb: FormBuilder, private apidata:ApiDataService){
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
    this.apidata.getRed(startDate,endDate).subscribe({
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
}
