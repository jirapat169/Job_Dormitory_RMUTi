import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-electric',
  templateUrl: './electric.component.html',
  styleUrls: ['./electric.component.scss'],
})
export class ElectricComponent implements OnInit {
  public roomSearchData: Array<any> = [];

  constructor(public service: AppService) {
    this.service.setHeaderPage('student-cost/electric', 'ค่าไฟประจำเดือน');
  }

  ngOnInit() {}

  public searchRoom = (roomNumber: string) => {
    this.roomSearchData = [];
    this.service
      .httpGet(
        `/admin/searchRoom/${roomNumber}?token=${
          this.service.getUserLogin()['token']
        }`
      )
      .then((value: any) => {
        console.log(value);
        if (value.success) {
          if (value.rowCount > 0) {
            this.roomSearchData = value.result;
            // console.log(this.roomSearchData);
          } else {
            this.roomSearchData = null;
          }
        }
      });
  };

  public getOldMonth = (month: string) => {
    return this.roomSearchData.filter((el) => {
      return el.month_read < month;
    }).length > 0
      ? this.roomSearchData.filter((el) => {
          return el.month_read < month;
        })[0]
      : null;
  };
}
