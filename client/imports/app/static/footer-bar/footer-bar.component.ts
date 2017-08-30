import { Component } from '@angular/core';

import template from './footer-bar.component.html';
import style from './footer-bar.component.scss';

@Component({
  selector: 'footer-bar',
  template,
  styles: [style]
})
export class FooterBarComponent { 
  year: number = (new Date()).getFullYear();
}
