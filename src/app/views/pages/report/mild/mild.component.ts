import { Component } from '@angular/core';
import { ApiDataService } from '../../../../core/services/api-data.service';
import { CommonModule,DatePipe } from '@angular/common';
import { ThaiDatePipe } from "../../../../core/pipes/thai-date.pipe";
@Component({
  selector: 'app-mild',
  standalone: true,
  imports: [
    CommonModule,
    ThaiDatePipe
  ],
  providers: [DatePipe],
  templateUrl: './mild.component.html',
  styleUrl: './mild.component.scss'
})
export class MildComponent {
followmild:any[] = [];

  constructor( private apidata:ApiDataService){ }
  ngOnInit(){
    this.apidata.followUpmild().subscribe((respone)=>{
      if(respone){
        this.followmild = respone;
      }
    });
  }
}
