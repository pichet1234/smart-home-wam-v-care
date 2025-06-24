import { Component, ViewChild } from '@angular/core';
import { RouterLink,Router } from '@angular/router';
import { ColumnMode, DatatableComponent, NgxDatatableModule } from '@siemens/ngx-datatable';
import { ApiDataService, Patient } from '../../../../core/services/api-data.service';
@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [
    RouterLink,
    NgxDatatableModule
  ],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.scss'
})
export class PatientComponent {
  rows: Patient[] = [];
  temp: Patient[] = [];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  @ViewChild('table') table: DatatableComponent
  constructor( private apidata: ApiDataService, private route: Router) {  }
  ngOnInit() {
    this.apidata.getPatient().subscribe({
      next: (data: Patient[]) => {
        this.temp = [...data];    // backup สำหรับ filter
        this.rows = data;         // แสดงข้อมูลในตาราง

        this.loadingIndicator = false;
      },
      error: (err) => {
        console.error('เกิดข้อผิดพลาดขณะโหลดข้อมูลผู้ป่วย', err);
        this.loadingIndicator = false;
      }
    });
  }
  onIconClick(row: any) {
    console.log('ID:', row._id, row.fname);
    this.route.navigate(['/patient/view-patient'], { queryParams: { pid: row._id } });
    }
  oniconEdit(row: any){
    console.log('ID:', row._id, row.fname);
    this.route.navigate(['/patient/edit-patient'], { queryParams: { pid: row._id } });   
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
