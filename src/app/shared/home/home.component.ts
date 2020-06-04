import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(public service: AppService) {}

  ngOnInit(): void {
    window.onload = () => {
      var calendarEl = document.getElementById('home-calendar');

      var calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
      });

      calendar.render();
    };
  }
}
