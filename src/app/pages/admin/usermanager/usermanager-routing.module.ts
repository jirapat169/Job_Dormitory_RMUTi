import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsermanagerComponent } from './usermanager.component';

const routes: Routes = [{ path: '', component: UsermanagerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsermanagerRoutingModule {}
