import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age',
  standalone: true
})
export class AgePipe implements PipeTransform {

  transform(value: string | Date): number | null {
    if (!value) return null;

    let birthDate: Date;

    // กรณีส่งเป็น string เช่น "09/11/2501"
    if (typeof value === 'string') {
      const [day, month, year] = value.split('/').map(Number);
      const gregorianYear = year > 2400 ? year - 543 : year; // ถ้าเป็น พ.ศ. ให้ลบ 543
      birthDate = new Date(gregorianYear, month - 1, day);
    } else {
      birthDate = new Date(value);
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  }

}
