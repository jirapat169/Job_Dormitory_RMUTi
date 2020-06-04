import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent implements OnInit {
  constructor(public service: AppService) {
    this.service.setHeaderPage('forget-password', 'ลืมรหัสผ่าน');
  }

  ngOnInit(): void {}
}
