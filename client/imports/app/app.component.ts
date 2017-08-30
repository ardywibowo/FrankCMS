import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { InjectUser } from "angular2-meteor-accounts-ui";

import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';

import template from './app.component.html';

let materialTheme = require('../../../node_modules/@angular/material/prebuilt-themes/indigo-pink.css');

@Component({
  selector: 'app',
  template,
  styles: [materialTheme.toString()]
})
@InjectUser('user')
export class AppComponent {

  // Sets initial value to true to show loading spinner on first load
  loading: boolean = true;
  mainTitle: string = 'Frank Stanford';

  constructor(private titleService: Title, private router: Router) {
    this.setTitle(this.mainTitle);

    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.loading = true;
    } else {
      this.loading = false;
    }
  }

}
