import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public calendarPlugins = [dayGridPlugin];

  constructor(public service: AppService) {}

  ngOnInit() {
    if (this.service.getUserLogin()['role'] == 'admin') {
      // console.log('hello');
    }
  }
}
