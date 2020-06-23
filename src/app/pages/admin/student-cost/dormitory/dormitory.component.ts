import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-dormitory',
  templateUrl: './dormitory.component.html',
  styleUrls: ['./dormitory.component.scss'],
})
export class DormitoryComponent implements OnInit {
  public studentSearchData: any = null;
  public costValue: Array<any> = [];

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
            this.getCostValue();
            this.studentSearchData = value.result[0];
            console.log(this.studentSearchData);
          } else {
            this.studentSearchData = null;
          }
        }
      });
  };

  private getCostValue = () => {
    this.costValue = [];
    this.service
      .httpGet(
        `/admin/getCostValue?token=${this.service.getUserLogin()['token']}`
      )
      .then((value: any) => {
        if (value) {
          if (value.rowCount > 0) {
            this.costValue = value.result;
          }
        }
        console.log(this.costValue);
      });
  };

  public searchCost = (term: string, room_type: string) => {
    return this.costValue.filter((el) => {
      return el.term == term && el.room_type == room_type;
    });
  };
}
