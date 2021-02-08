import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  public listAdminType: Array<any> = [];
  public listAdminUsers: Array<any> = [];
  public userForm: FormGroup;
  public userPassword: FormGroup;
  public userSelected: boolean = false;

  constructor(public service: AppService, private formBuilder: FormBuilder) {}

  async ngOnInit() {
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      nameTitle: ['', [Validators.required]],
      fname: ['', [Validators.required]],
      lname: ['', [Validators.required]],
      personalId: ['', [Validators.required]],
      type: ['', [Validators.required]],
      role: ['admin', [Validators.required]],
    });

    this.userPassword = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      re_password: ['', [Validators.required]],
    });

    await this.getAdminType();
    await this.getAdminUsers();
  }

  public searchAdmin = (data: any) => {
    let searchDataArray = this.listAdminUsers.filter(
      (e) => JSON.stringify(e).indexOf(data.value) != -1
    );

    searchDataArray.length > 0 && [
      (this.userSelected = true),
      this.userForm.patchValue({
        username: searchDataArray[0]['username'],
        nameTitle: searchDataArray[0]['nameTitle'],
        fname: searchDataArray[0]['fname'],
        lname: searchDataArray[0]['lname'],
        personalId: searchDataArray[0]['personalId'],
        type: searchDataArray[0]['type'],
      }),
      this.userPassword.patchValue({
        username: searchDataArray[0]['username'],
      }),
    ];

    searchDataArray.length == 0 && [
      (this.userSelected = false),
      this.service.showAlert('ไม่พบข้อมูล', '', 'warning'),
      (data.value = ''),
    ];
  };

  private getAdminType = async () => {
    await this.service
      .httpGet(`/support/getAdminType`)
      .then((val) => {
        if (val['success']) {
          if (val['rowCount'] > 0) {
            this.listAdminType = val['result'];
          }
        }

        console.log(this.listAdminType);
      })
      .catch((reason) => {
        console.log(reason);
      });
  };

  private getAdminUsers = async () => {
    await this.service
      .httpGet(`/support/getAdminUsers`)
      .then((val) => {
        if (val['success']) {
          if (val['rowCount'] > 0) {
            this.listAdminUsers = val['result'];
          }
        }

        console.log(this.listAdminUsers);
      })
      .catch((reason) => {
        console.log(reason);
      });
  };

  public formAdminSubmit = () => {
    console.log(this.userForm.value);
  };

  public formUserPassword = () => {
    console.log(this.userPassword.value);
  };
}
