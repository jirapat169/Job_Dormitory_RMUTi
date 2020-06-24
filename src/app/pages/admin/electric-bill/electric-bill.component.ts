import { AppService } from './../../../services/app.service';
import { Component, OnInit } from '@angular/core';
import { Form, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-electric-bill',
  templateUrl: './electric-bill.component.html',
  styleUrls: ['./electric-bill.component.scss'],
})
export class ElectricBillComponent implements OnInit {
  public serverTime: Date = new Date();
  public allRoom: Array<any> = [];
  public currentBill: Array<any> = [];
  public buildSelect: string = '1';
  public floorSelect: string = '2';
  public roomSelected: Array<any> = [];

  constructor(public service: AppService) {
    this.service.setHeaderPage('electric-bill', 'บันทึกค่ามิเตอร์ไฟฟ้า');
  }

  async ngOnInit() {
    this.serverTime = await this.getServerTime();
    this.allRoom = await this.getRoom();
    this.currentBill = await this.getCurrentMeter();
    this.selectRoom();
  }

  private getCurrentMeter = (): Promise<any> => {
    return new Promise((resolve) => {
      this.service
        .httpGet(
          `/admin/getCurrentMeter/${this.service.zeroPad(
            this.serverTime.getMonth() + 1,
            10
          )}/${this.serverTime.getFullYear()}?token=${
            this.service.getUserLogin()['token']
          }`
        )
        .then((value: any) => {
          resolve(value.result);
        });
    });
  };

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
        .httpGet(
          `/support/getRoom?token=${this.service.getUserLogin()['token']}`
        )
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
    this.sumFirstCost(data.room_number, data.meter);
    this.service
      .showConfirm(
        `ห้อง ${data.room_number}`,
        'หากบันทึกข้อมูลแล้วจะไม่สามารถแก้ไขได้',
        'warning'
      )
      .then((value: boolean) => {
        if (value) {
          let rawData = {
            room_number: data.room_number,
            value_meter: data.meter,
            month_read: `${this.service.zeroPad(
              this.serverTime.getMonth() + 1,
              10
            )}/${this.serverTime.getFullYear()}`,
            user_edit: this.service.getUserLogin()['username'],
            ...this.sumFirstCost(data.room_number, data.meter),
          };

          if (data.old) {
            if (data.meter >= parseInt(data.old.value_meter)) {
              this.service
                .httpPost(
                  `/admin/setCurrentMeter?token=${
                    this.service.getUserLogin()['token']
                  }`,
                  JSON.stringify(rawData)
                )
                .then(async (value: any) => {
                  if (value) {
                    this.currentBill = await this.getCurrentMeter();
                  }
                });
            } else {
              this.service.showAlert(
                data.room_number,
                'โปรดกรอกข้อมูลให้ถูกต้อง',
                'warning'
              );
            }
          } else {
            this.service
              .httpPost(
                `/admin/setCurrentMeter?token=${
                  this.service.getUserLogin()['token']
                }`,
                JSON.stringify(rawData)
              )
              .then(async (value: any) => {
                if (value) {
                  this.currentBill = await this.getCurrentMeter();
                }
              });
          }
        }
      });
  };

  public getMeterBill = (room_number: string, month_read: string) => {
    let bill = this.currentBill.filter((el) => {
      return el.room_number == room_number && el.month_read == month_read;
    });
    return bill.length > 0 ? bill[0] : null;
  };

  private sumFirstCost = (room_number, current_meter) => {
    let electric_cost_unit: number; // หน่วยไฟฟ้าเดือนนี้
    let electric_cost_old: number; // ค่าไฟคงเหลือยกยอดมา
    let electric_cost_month: number; // ค่าไฟเดือนนี้
    let electric_cost_left: number; // ค่าไฟคงเหลือยกยอดไป
    let electric_cost_add: number; // ค่าไฟที่ต้องจ่ายเพิ่ม
    let isPay: number; // สถานะการหักเงินสำเร็จ ( 0 = ไม่สำเร็จ, 1 = สำเร็จ )

    let firstCost = this.currentBill
      .filter((el) => {
        return el.room_number == room_number;
      })
      .sort((a, b) => {
        return b['value_meter'] - a['value_meter'];
      });

    electric_cost_unit =
      firstCost.length > 0
        ? parseInt(current_meter) - parseInt(firstCost[0]['value_meter'])
        : parseInt(current_meter); // หน่วยไฟฟ้าเดือนนี้

    electric_cost_old =
      firstCost.length > 0
        ? parseInt(firstCost[0]['electric_cost_left'])
        : room_number == '1201'
        ? 4000
        : 2000 -
            firstCost.reduce(
              (a, b) => parseInt(a) + parseInt(b['electric_cost_old'] || 0),
              0
            ) >
          0
        ? room_number == '1201'
          ? 4000
          : 2000 -
            firstCost.reduce(
              (a, b) => parseInt(a) + parseInt(b['electric_cost_old'] || 0),
              0
            )
        : 0; // ค่าไฟคงเหลือยกยอดมา

    electric_cost_month = electric_cost_unit * 8; // ค่าไฟเดือนนี้

    electric_cost_left =
      electric_cost_old > 0
        ? electric_cost_old - electric_cost_month > 0
          ? electric_cost_old - electric_cost_month
          : 0
        : 0; // ค่าไฟคงเหลือยกยอดไป

    electric_cost_add =
      electric_cost_old - electric_cost_month >= 0
        ? 0
        : Math.abs(electric_cost_old - electric_cost_month); // ค่าไฟที่ต้องจ่ายเพิ่ม

    isPay = electric_cost_add <= 0 ? 1 : 0; // สถานะการหักเงินสำเร็จ

    return {
      electric_cost_unit: electric_cost_unit,
      electric_cost_old: electric_cost_old,
      electric_cost_month: electric_cost_month,
      electric_cost_left: electric_cost_left,
      electric_cost_add: electric_cost_add,
      isPay: isPay,
    };
  };
}
