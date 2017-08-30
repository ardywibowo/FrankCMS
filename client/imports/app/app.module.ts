import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccountsModule } from 'angular2-meteor-accounts-ui';
import { MaterialModule } from "@angular/material";
import { FileDropModule } from "angular2-file-drop";
import { Ng2PaginationModule } from 'ng2-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollToModule } from 'ng2-scroll-to';

import { AppComponent } from './app.component';
import { routes, AuthGuard } from './app.routes';
import { STATIC_COMPONENTS } from './static';
import { CONTENT_COMPONENTS } from './content';
import { DASHBOARD_COMPONENTS } from './dashboard';
import { SHARED_DECLARATIONS } from './shared';
import { ARTGRID_COMPONENTS } from './artwork-grid';
import { AUTH_COMPONENTS } from './auth';
import 'hammerjs';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    AccountsModule,
    MaterialModule,
    BrowserAnimationsModule,
    FileDropModule,
    Ng2PaginationModule,
    ScrollToModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    ...STATIC_COMPONENTS,
    ...CONTENT_COMPONENTS,
    ...DASHBOARD_COMPONENTS,
    ...ARTGRID_COMPONENTS,
    ...AUTH_COMPONENTS,
    ...SHARED_DECLARATIONS
  ],
  providers: [
    Title,
    AuthGuard
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
