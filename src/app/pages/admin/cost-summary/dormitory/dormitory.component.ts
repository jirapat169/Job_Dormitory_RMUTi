import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-dormitory',
  templateUrl: './dormitory.component.html',
  styleUrls: ['./dormitory.component.scss'],
})
export class DormitoryComponent implements OnInit {
  public date = new FormControl(new Date());
  public listStudentCost: Array<any> = [];
  public listStudentCostOnDate: Array<any> = [];

  constructor(public service: AppService) {}

  ngOnInit(): void {
    this.getAllStudentCost();
    console.log(this.service.ArabicNumberToText('12345'));
  }

  public getAllStudentCost = () => {
    this.service
      .httpGet(
        `/admin/getAllStudentCost?token=${this.service.getUserLogin()['token']}`
      )
      .then((val: any) => {
        console.log(val);
        if (val.rowCount > 0) {
          this.listStudentCost = val.result;
          this.dateChange(this.date.value);
        } else {
          this.listStudentCost = [];
        }
      });
  };

  public dateChange = (data) => {
    let timeSelect = new Date(data).toISOString().split('T')[0];
    let result = this.listStudentCost.filter((e) => {
      return new Date(e.update_time).toISOString().split('T')[0] == timeSelect;
    });
    this.listStudentCostOnDate = result;
  };

  public sumCost = (data) => {
    let sum =
      parseInt(data.electric_first) +
      parseInt(data.dorimitory) +
      parseInt(data.water_first) +
      parseInt(data.insurance);
    return sum;
  };

  public subDate = (date) => {
    let nD = new Date(date);
    return `${this.service.zeroPad(nD.getDate(), 10)}/${this.service.zeroPad(
      nD.getMonth() + 1,
      10
    )}/${this.service.zeroPad(nD.getFullYear() + 543, 1000)}`;
  };
}
