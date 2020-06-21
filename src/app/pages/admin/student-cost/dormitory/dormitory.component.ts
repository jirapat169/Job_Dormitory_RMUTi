import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-dormitory',
  templateUrl: './dormitory.component.html',
  styleUrls: ['./dormitory.component.scss'],
})
export class DormitoryComponent implements OnInit {
  public studentSearchData: any = null;

  constructor(public service: AppService) {
    this.service.setHeaderPage('student-cost/dormitory', 'ค่าใช้จ่ายหอพัก');
  }

  ngOnInit() {}

  public searchStudent = (studentId: string) => {
    this.service
      .httpGet(
        `/admin/searchStudent/${studentId}?token=${
          this.service.getUserLogin()['token']
        }`
      )
      .then((value: any) => {
        if (value.success) {
          if (value.rowCount > 0) {
            this.studentSearchData = value.result[0];
            console.log(this.studentSearchData);
          } else {
            this.studentSearchData = null;
          }
        }
      });
  };
}
