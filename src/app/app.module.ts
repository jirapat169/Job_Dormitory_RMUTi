import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScullyLibModule } from '@scullyio/ng-lib';
import { DefaultLayoutComponent } from './components/default-layout/default-layout.component';
import { PrivateLayoutComponent } from './components/private-layout/private-layout.component';
import { LayoutModule } from '@angular/cdk/layout';
import { AppService } from './services/app.service';
import { RootGuard } from './guards/root.guard';
import { MyGuard } from './guards/my.guard';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { SharedModule } from './shared/shared-module';

@NgModule({
  declarations: [
    AppComponent,
    DefaultLayoutComponent,
    PrivateLayoutComponent,
    NotfoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ScullyLibModule,
    LayoutModule,
    SharedModule,
  ],
  providers: [AppService, RootGuard, MyGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
