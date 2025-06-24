import { Component } from '@angular/core';
import { ApiDataService } from '../../../../core/services/api-data.service';
import { CommonModule,DatePipe } from '@angular/common';
import { ThaiDatePipe } from "../../../../core/pipes/thai-date.pipe";
@Component({
  selector: 'app-moderate',
  standalone: true,
  imports: [
    CommonModule,
    ThaiDatePipe
  ],
  providers: [DatePipe],
  templateUrl: './moderate.component.html',
  styleUrl: './moderate.component.scss'
})
export class ModerateComponent {
followmoderate:any[] = [];
  constructor( private apidata:ApiDataService){ }
  ngOnInit(){
    this.apidata.followUpmoderate().subscribe((respone)=>{
      if(respone){
        this.followmoderate = respone;
      }
    });
  }
}
