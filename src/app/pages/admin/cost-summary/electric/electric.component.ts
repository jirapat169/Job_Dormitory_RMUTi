import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-electric',
  templateUrl: './electric.component.html',
  styleUrls: ['./electric.component.scss'],
})
export class ElectricComponent implements OnInit {
  public date = new FormControl(new Date());
  public listStudentCost: Array<any> = [];
  public listStudentCostOnDate: Array<any> = [];

  constructor(public service: AppService) {}

  ngOnInit(): void {
    this.getAllStudentCost();
  }

  public getAllStudentCost = () => {
    this.service
      .httpGet(
        `/admin/getAllElectricCost?token=${
          this.service.getUserLogin()['token']
        }`
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

  public sumCol = (data, key) => {
    let sum = 0;
    data.forEach((e, i) => {
      sum += parseInt(e[key]);
    });
    return sum;
  };

  public dateChange = (data) => {
    let timeSelect = new Date(data).toLocaleDateString();
    let result = this.listStudentCost.filter((e) => {
      return new Date(e.time_pay).toLocaleDateString() == timeSelect;
    });
    this.listStudentCostOnDate = result;
  };

  public subDate = (date) => {
    let nD = new Date(date);
    return `${this.service.zeroPad(nD.getDate(), 10)}/${this.service.zeroPad(
      nD.getMonth() + 1,
      10
    )}/${this.service.zeroPad(nD.getFullYear() + 543, 1000)}`;
  };

  public sumCost = (data) => {
    let sum =
      parseInt(data.electric_first) +
      parseInt(data.dorimitory) +
      parseInt(data.water_first) +
      parseInt(data.insurance);
    return sum;
  };
}
