import { DefaultLayoutComponent } from './components/default-layout/default-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivateLayoutComponent } from './components/private-layout/private-layout.component';
import { RootGuard } from './guards/root.guard';
import { MyGuard } from './guards/my.guard';

const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: 'login',
        loadChildren: () =>
          import('./pages/default/login/login.module').then(
            (m) => m.LoginModule
          ),
      },
      {
        path: 'register',
        loadChildren: () =>
          import('./pages/default/register/register.module').then(
            (m) => m.RegisterModule
          ),
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('./shared/contact/contact.module').then(
            (m) => m.ContactModule
          ),
      },
      {
        path: 'root',
        component: PrivateLayoutComponent,
        data: { role: 'admin' },
        canActivate: [RootGuard],
        children: [
          {
            path: 'home',
            loadChildren: () =>
              import('./shared/home/home.module').then((m) => m.HomeModule),
          },
          {
            path: 'contact',
            loadChildren: () =>
              import('./shared/contact/contact.module').then(
                (m) => m.ContactModule
              ),
          },
          {
            path: '',
            redirectTo: '/root/home',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'my',
        component: PrivateLayoutComponent,
        data: { role: 'student' },
        canActivate: [MyGuard],
        children: [
          {
            path: 'home',
            loadChildren: () =>
              import('./shared/home/home.module').then((m) => m.HomeModule),
          },
          {
            path: 'contact',
            loadChildren: () =>
              import('./shared/contact/contact.module').then(
                (m) => m.ContactModule
              ),
          },
          {
            path: '',
            redirectTo: '/my/home',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
