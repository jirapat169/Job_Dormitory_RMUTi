import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private currentRouter: string = '/';
  private currentRouterSubscribe: Observable<any>;
  private httpRootURL: string =
    'http://cpe.rmuti.ac.th/project/dormitory/cost/api/index.php/';
  private userLogin: any = null;
  private showLoading: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  public getRouter = (callback: (arg0: string) => void) => {
    this.currentRouterSubscribe = this.router.events;
    callback(this.currentRouter);
    this.currentRouterSubscribe.subscribe((value: Event) => {
      if (value instanceof NavigationEnd) {
        this.currentRouter = value.url;
        callback(this.currentRouter);
      }
    });
  };

  public navRouter = (path: string, params: any = {}) => {
    this.router.navigate([`${path}`], { queryParams: params });
  };

  // ---------------------------------------------------- //

  public setUserLogin = (data: any) => {
    this.userLogin = data;
    this.localStorage.set('userLogin', data);
  };

  public getUserLogin = () => {
    return this.userLogin;
  };

  // ---------------------------------------------------- //

  public localStorage = {
    get: (key: string) => {
      return JSON.parse(window.localStorage.getItem('dormitory_' + key));
    },
    set: (key: string, value: any) => {
      value = JSON.stringify(value);
      window.localStorage.setItem('dormitory_' + key, value);
    },
    clear: () => {
      window.localStorage.clear();
    },
  };

  // ---------------------------------------------------- //

  public httpPost = (url: string, payload: any) => {
    this.loading.show();
    return new Promise(async (resolve) => {
      await this.delay(1000);
      this.http
        .post(`${this.httpRootURL}${url}`, payload)
        .toPromise()
        .then((value: any) => {
          resolve(value);
        })
        .catch((reason: any) => {
          resolve(null);
          console.log(reason);
          this.showAlert('', 'การเชื่อมต่อเซิร์ฟเวอร์ผิดพลาด', 'warning');
        })
        .finally(() => {
          this.loading.hide();
        });
    });
  };

  public httpGet = (url: string) => {
    this.loading.show();
    return new Promise(async (resolve) => {
      await this.delay(1000);
      this.http
        .get(`${this.httpRootURL}${url}`)
        .toPromise()
        .then((value: any) => {
          resolve(value);
        })
        .catch((reason: any) => {
          resolve(null);
          console.log(reason);
          this.showAlert('', 'การเชื่อมต่อเซิร์ฟเวอร์ผิดพลาด', 'warning');
        })
        .finally(() => {
          this.loading.hide();
        });
    });
  };

  // ---------------------------------------------------- //

  public showAlert = (
    title: string,
    message: string,
    type: 'success' | 'warning' | 'error'
  ) => {
    Swal.fire({
      icon: type,
      title: title,
      text: message,
      confirmButtonText: 'ตกลง',
    });
  };

  // ---------------------------------------------------- //

  public loading = {
    show: () => {
      this.showLoading = true;
    },
    hide: async () => {
      await this.delay(500);
      this.showLoading = false;
    },
    status: () => {
      return this.showLoading;
    },
  };

  // ---------------------------------------------------- //

  public delay = (ms: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  };
}
