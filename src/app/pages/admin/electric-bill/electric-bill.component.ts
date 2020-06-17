import { AppService } from './../../../services/app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-electric-bill',
  templateUrl: './electric-bill.component.html',
  styleUrls: ['./electric-bill.component.scss'],
})
export class ElectricBillComponent implements OnInit {
  public serverTime: Date = new Date();
  public allRoom: Array<any> = [];
  public buildSelect: string = '1';
  public floorSelect: string = '2';
  public roomSelected: Array<any> = [];

  constructor(public service: AppService) {}

  async ngOnInit() {
    this.serverTime = await this.getServerTime();
    this.allRoom = await this.getRoom();
    this.selectRoom();
  }

  private getServerTime = (): any => {
    return new Promise((resolve) => {
      this.service
        .httpGet(
          `/support/getServerTime?token=${this.service.getUserLogin()['token']}`
        )
        .then((value: any) => {
          resolve(new Date(value.result));
        });
    });
  };

  private getRoom = (): any => {
    return new Promise((resolve) => {
      this.service
        .httpGet(`/admin/getRoom?token=${this.service.getUserLogin()['token']}`)
        .then((value: any) => {
          if (value.result.result.length > 0) {
            resolve(value.result.result); // room_number
          } else {
            resolve([]);
          }
        });
    });
  };

  public selectRoom = () => {
    let build: Array<any> = this.allRoom.filter((el) => {
      return el.room_number.charAt(0) == this.buildSelect;
    });

    let floor: Array<any> = build.filter((el) => {
      return el.room_number.charAt(1) == this.floorSelect;
    });

    this.roomSelected = floor;
  };

  public updateBill = (data: any) => {
    console.log(data);
  };
}
