import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AppService } from 'src/app/services/app.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss'],
})
export class PrivateComponent implements OnInit {
  public isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  public menuList: Array<{ icon: string; name: string; path: string }> = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    public service: AppService
  ) {}

  ngOnInit() {
    if (this.service.getUserLogin()['role'] == 'admin') {
      this.menuList = [
        {
          icon: 'fas fa-users-cog',
          name: 'จัดการบัญชีผู้ใช้',
          path: '/usermanager',
        },
      ];
    } else {
    }
  }

  public onLogout = () => {
    this.service
      .showConfirm('', 'ยืนยันการออกจากระบบ', 'warning')
      .then((value) => {
        if (value) {
          this.service.localStorage.clear();
          window.location.replace(environment.ssoLogout);
        }
      });
  };
}
