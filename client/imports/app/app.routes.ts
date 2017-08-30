import { Injectable } from '@angular/core';
import { Route, Router, CanActivate } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { ExposeComponent } from './static/expose/expose.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './auth/login.component';
import { RecoverComponent } from './auth/recover.component';
import { ResetComponent } from './auth/reset.component';

import { ArtworkExposeComponent, PhotoExposeComponent, SculptureExposeComponent, 
  TravelExposeComponent, WritingExposeComponent } from './content/artwork-expose/artwork-expose.component';

@Injectable()
export class AuthGuard implements CanActivate {

auth: any = {};

constructor(private router: Router) {}

  canActivate() {
    if (!!Meteor.userId()) {
      return true;
    }
    else {
      this.router.navigate(['']);
      return false;
    }
  }
}

export const routes: Route[] = [
  { path: '', component: ExposeComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  
  { path: 'photography', component: PhotoExposeComponent },
  { path: 'sculpture', component: SculptureExposeComponent },
  { path: 'travels', component: TravelExposeComponent },
  { path: 'writing', component: WritingExposeComponent },

  { path: 'login', component: LoginComponent },
  { path: 'recover', component: RecoverComponent },
  { path: 'reset-password/:token', component: ResetComponent },

  { path: '**', redirectTo: '' }
];
