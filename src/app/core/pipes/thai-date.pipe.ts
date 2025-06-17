import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'thaiDate',
  standalone: true
})
export class ThaiDatePipe implements PipeTransform {
constructor(private datePipe: DatePipe){}
  transform(value: Date | string, format: string = 'd MMM yyyy'): string {
    const formattedDate = this.datePipe.transform(value, format);
    if (formattedDate) {
      const dateParts = formattedDate.split(' ');
      const day = dateParts[0];
      const month = this.convertMonthToThai(dateParts[1]);  // แปลงเดือนเป็นไทย
      let year = parseInt(dateParts[2], 10) + 543;  // แปลงปีจาก ค.ศ. เป็น พ.ศ.
      
      return `${day} ${month}. ${year}`;
    }
    return '';
  }

  // ฟังก์ชันแปลงชื่อเดือนเป็นภาษาไทย
  convertMonthToThai(month: string): string {
    const monthMap: { [key: string]: string } = {
      'Jan': 'ม.ค',
      'Feb': 'ก.พ',
      'Mar': 'มี.ค',
      'Apr': 'เม.ย',
      'May': 'พ.ค',
      'Jun': 'มิ.ย',
      'Jul': 'ก.ค',
      'Aug': 'ส.ค',
      'Sep': 'ก.ย',
      'Oct': 'ต.ค',
      'Nov': 'พ.ย',
      'Dec': 'ธ.ค'
    };
    return monthMap[month] || month;
  }

}
