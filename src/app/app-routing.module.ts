import { DefaultLayoutComponent } from './components/default-layout/default-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivateComponent } from './components/private/private.component';
import { CheckLoginGuard } from './guards/check-login.guard';

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
        path: '',
        component: PrivateComponent,
        canActivate: [CheckLoginGuard],
        children: [
          {
            path: 'home',
            loadChildren: () =>
              import('./shared/home/home.module').then((m) => m.HomeModule),
          },
          {
            path: '',
            redirectTo: '/home',
            pathMatch: 'full',
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
