import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  constructor(public service: AppService) {
    this.service.setHeaderPage('changepassword', 'เปลี่ยนรหัสผ่าน');
  }

  ngOnInit(): void {}
}
