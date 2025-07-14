import { Component } from '@angular/core';
import { ApiDataService } from '../../../../core/services/api-data.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ThaiDatePipe } from "../../../../core/pipes/thai-date.pipe";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-risk',
  standalone: true,
  imports: [
    NgbAlertModule,
    ReactiveFormsModule,
    CommonModule,
    ThaiDatePipe
  ],
  providers: [DatePipe],
  templateUrl: './risk.component.html',
  styleUrl: './risk.component.scss'
})
export class RiskComponent {
  followred: any[] = [];
  showform: boolean = false;
  showtable: boolean = true;
  a: boolean = false;
  totalScore: number = 0;
  answerOptions1 = [{ label: 'ไม่มี', value: 0 }, { label: 'มี', value: 1 }];
  answerOptions2 = [{ label: 'ไม่มี', value: 0 }, { label: 'มี', value: 2 }];
  answerOptions3 = [{ label: 'ไม่มี', value: 0 }, { label: 'มี', value: 6 }];
  answerOptions3_1 = [{ label: 'ได้', value: 0 }, { label: 'ไม่ได้', value: 8 }];
  answerOptions4 = [{ label: 'ไม่มี', value: 0 }, { label: 'มี', value: 8 }];
  answerOptions5 = [{ label: 'ไม่มี', value: 0 }, { label: 'มี', value: 9 }];
  answerOptions6 = [{ label: 'ไม่มี', value: 0 }, { label: 'มี', value: 4 }];
  answerOptions7 = [{ label: 'ไม่มี', value: 0 }, { label: 'มี', value: 10 }];
  answerOptions8 = [{ label: 'ไม่มี', value: 0 }, { label: 'มี', value: 4 }];

  answers: number[] = []; // เช่น answers[0] เก็บคำตอบของข้อที่ 1
  form: FormGroup;
  showAlert = false;
  alertType = 'info'; // default: primary/info/warning/danger
  path: string = '8q'
  constructor(private apidata: ApiDataService, private fb: FormBuilder) {
    this.form = this.fb.group({
      pid: [''],
      userid: [null],
      answer1: [''],
      answer2: [''],
      answer3: [''],
      answer31: [0], // คำถามเสริมของข้อ 3
      answer4: [''],
      answer5: [''],
      answer6: [''],
      answer7: [''],
      answer8: [''],
      totalScore: [''],
      risklevel: ['']
    });
  }

  ngOnInit(): void {
    this.apidata.followUpred().subscribe((respone) => {
      if (respone) {
        this.followred = respone;
      }
    });
  }
  onAnswer3Change(value: number) {
    this.a = value > 0;
    if (!this.a) {
      this.form.patchValue({ answer31: 0 });
    }
  }
  onClickass(id: any) {
    console.log(id)
    this.showform = true;
    this.showtable = false;
    this.form.patchValue({
      pid:id
    })
  }
  onSubmit() {
    const formValue = this.form.value;

    // คำนวณคะแนนรวม (ไม่รวม answer31 ถ้าไม่ได้แสดง)
    let total = 0;
    for (let i = 1; i <= 8; i++) {
      const v = Number(formValue[`answer${i}`]);
      total += isNaN(v) ? 0 : v;
    }

    // รวม answer31 ถ้าแสดง
    if (this.a && formValue.answer31) {
      total += Number(formValue.answer31);
    }
  
    /**
     * risklevel
     * 0 ไม่มีแนวโน้มฆ่าตัวตายในปัจจุบัน
     * 1-8 มีแนวโน้มที่จะฆ่าตัวตายในปัจจุบัน ระดับน้อย
     * 9-16 มีแนวโน้มที่จะฆ่าตัวตายในปัจจุบัน ระดับปานกลาง
     * >= 17 มีแนวโน้มที่จะฆ่าตัวตายในปัจจุบัน ระดับรุนแรง
     */

     let riskLevelText = '';
     let alertColor = 'info';
  if (total === 0) {
    riskLevelText = 'ไม่มีแนวโน้มฆ่าตัวตายในปัจจุบัน';
    alertColor = 'success';
  } else if (total >= 1 && total <= 8) {
    riskLevelText = 'มีแนวโน้มที่จะฆ่าตัวตายในปัจจุบัน ระดับน้อย';
    alertColor = 'primary';
  } else if (total >= 9 && total <= 16) {
    riskLevelText = 'มีแนวโน้มที่จะฆ่าตัวตายในปัจจุบัน ระดับปานกลาง';
    alertColor = 'warning';
  } else if (total >= 17) {
    riskLevelText = 'มีแนวโน้มที่จะฆ่าตัวตายในปัจจุบัน ระดับรุนแรง';
    alertColor = 'danger';
  }
    this.form.patchValue({
      totalScore: total,
      risklevel: riskLevelText
    });
    this.alertType = alertColor;
    this.showAlert = true;
    console.log(this.form.value);
  //ส่งไปยัง backend 
    this.apidata.sendData(this.path, this.form.value).subscribe(
      (response) => {
        if (response) {
          console.log(response.data);
        } else {
          console.log('error response');
        }
      },
      (err) => {
        console.log('error response', err);
      }
    );
  }

}
