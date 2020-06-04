import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Title, Meta } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

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

  constructor(
    private router: Router,
    private http: HttpClient,
    private titleService: Title,
    private metaService: Meta
  ) {}

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
          if (value.isLogin == false) {
            this.showAlert('', value.message, 'warning');
            this.navRouter('/login', { oldPath: this.currentRouter });
          }
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
          if (value.isLogin == false) {
            this.showAlert('', value.message, 'warning');
            this.navRouter('/login', { oldPath: this.currentRouter });
          }
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

  public showConfirm = (
    title: string,
    message: string,
    type: 'success' | 'warning' | 'error'
  ) => {
    return new Promise((resolve) => {
      Swal.fire({
        title: title,
        text: message,
        icon: type,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
        focusCancel: true,
      }).then((result) => {
        if (result.value) {
          resolve(true);
        }
        resolve(false);
      });
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

  // ---------------------------------------------------- //

  public setHeaderPage = (path: string, title: string = null) => {
    let canonical: any = document.getElementById('canonical');
    canonical['href'] = `${environment.url}${path}`;

    let alternate: any = document.getElementById('alternate');
    alternate['href'] = `${environment.url}${path}`;

    this.titleService.setTitle(
      `${
        title ? title + ' - ' : ''
      }ระบบเว็บแอปพลิเคชันการจัดการค่าใช้จ่ายนักศึกษา`
    );

    this.metaService.updateTag({
      name: 'keywords',
      content: `${
        title ? title + ', ' : ''
      } ระบบเว็บแอปพลิเคชันการจัดการค่าใช้จ่ายนักศึกษา, หอพักนักศึกษา, หอใน, เทคโน, เทคโนโคราช, rmuti, ค่าน้ำค่าไฟ, ค่าประกันหอ, ค่าใช้จ่ายหอใน, หอพักนักศึกษามหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน, นครราชสีมา`,
    });
    this.metaService.updateTag({
      name: 'description',
      content:
        'เว็บแอปพลิเคชันจัดการในการเก็บข้อมูลหอพัก ค่าไฟหอพัก โดยการตรวจสอบสถานะของนักศึกษาที่ค้างชำระค่าหอพักนักศึกษา ค่าประกันหอพัก คำนวณการใช้หน่วยไฟฟ้าของแต่ละห้องคำนวณออกมา และสมารถสรุปผลเป็นรายเดือนรายปีได้ จึงได้ทำการเก็บข้อมูลจากหอพักนักศึกษาเก็บกับค่าใช้จ่ายและรายละเอียดต่าง ๆ จากสำนักงานหอพักนักศึกษามหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน นครราชสีมา',
    });
    this.metaService.updateTag({ name: 'robots', content: 'index, follow' });
    this.metaService.updateTag({
      property: 'og:url',
      content: `${environment.url}${path}`,
    });
    this.metaService.updateTag({ property: 'og:type', content: `website` });
    this.metaService.updateTag({
      property: 'og:title',
      content: `${
        title ? title + ' - ' : ''
      }ระบบเว็บแอปพลิเคชันการจัดการค่าใช้จ่ายนักศึกษา`,
    });
    this.metaService.updateTag({
      property: 'og:description',
      content: `เว็บแอปพลิเคชันจัดการในการเก็บข้อมูลหอพัก ค่าไฟหอพัก โดยการตรวจสอบสถานะของนักศึกษาที่ค้างชำระค่าหอพักนักศึกษา ค่าประกันหอพัก คำนวณการใช้หน่วยไฟฟ้าของแต่ละห้องคำนวณออกมา และสมารถสรุปผลเป็นรายเดือนรายปีได้ จึงได้ทำการเก็บข้อมูลจากหอพักนักศึกษาเก็บกับค่าใช้จ่ายและรายละเอียดต่าง ๆ จากสำนักงานหอพักนักศึกษามหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน นครราชสีมา`,
    });
    this.metaService.updateTag({
      property: 'og:image',
      content: `${environment.url}asset/img/RMUTI_LOGO.png`,
    });
    this.metaService.updateTag({
      property: 'twitter:card',
      content: `summary`,
    });
    this.metaService.updateTag({
      property: 'twitter:title',
      content: `${
        title ? title + ' - ' : ''
      }ระบบเว็บแอปพลิเคชันการจัดการค่าใช้จ่ายนักศึกษา`,
    });
    this.metaService.updateTag({
      property: 'twitter:image',
      content: `${environment.url}asset/img/RMUTI_LOGO.png`,
    });
    this.metaService.updateTag({
      property: 'twitter:description',
      content: `เว็บแอปพลิเคชันจัดการในการเก็บข้อมูลหอพัก ค่าไฟหอพัก โดยการตรวจสอบสถานะของนักศึกษาที่ค้างชำระค่าหอพักนักศึกษา ค่าประกันหอพัก คำนวณการใช้หน่วยไฟฟ้าของแต่ละห้องคำนวณออกมา และสมารถสรุปผลเป็นรายเดือนรายปีได้ จึงได้ทำการเก็บข้อมูลจากหอพักนักศึกษาเก็บกับค่าใช้จ่ายและรายละเอียดต่าง ๆ จากสำนักงานหอพักนักศึกษามหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน นครราชสีมา`,
    });
  };
}
