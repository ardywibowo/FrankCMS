import { Component } from '@angular/core';
import { Category } from '../../../../../both/models/artwork.model';

import template from './expose.component.html';
import style from './expose.component.scss';

@Component({
  selector: 'expose',
  template,
  styles: [style]
})
export class ExposeComponent { 
  public Category = Category;
}
