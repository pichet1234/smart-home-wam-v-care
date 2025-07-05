import { Component } from '@angular/core';
import { ApiDataService } from '../../../../core/services/api-data.service';
import { CommonModule,DatePipe } from '@angular/common';
import { ThaiDatePipe } from "../../../../core/pipes/thai-date.pipe";
@Component({
  selector: 'app-risk',
  standalone: true,
  imports: [
    CommonModule,
    ThaiDatePipe
  ],
  providers: [DatePipe],
  templateUrl: './risk.component.html',
  styleUrl: './risk.component.scss'
})
export class RiskComponent {
followred:any[] = [];
showform: boolean = false;
showtable:boolean = true;
  constructor( private apidata:ApiDataService){ }

  ngOnInit(): void {
    this.apidata.followUpred().subscribe((respone)=>{
      if(respone){
        this.followred = respone;
      }
    });
  }

  onClickass(id:any){
    console.log(id)
    this.showform = true;
    this.showtable = false;
  }
}
