import { Component } from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  ActivatedRoute,
} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'dormitory';
  constructor(private router: Router) {
    this.router.events.subscribe(async (event) => {
      // console.log(this.router.url);

      switch (true) {
        case event instanceof NavigationStart: {
          // this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          // this.loading = false;
          let baseHref: any = document.getElementById('baseHref');
          baseHref['href'] = '/';
          break;
        }
        default: {
          break;
        }
      }
    });
  }
}
