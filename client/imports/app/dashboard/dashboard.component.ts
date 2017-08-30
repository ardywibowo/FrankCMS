import { Component } from '@angular/core';
import { PaginationService } from 'ng2-pagination';
import { ArtworksList } from '../shared-components/artworks-list.class';
import { Category } from '../../../../both/models/artwork.model';

import template from './dashboard.component.html';
import style from './dashboard.component.scss';

@Component({
  selector: 'dashboard',
  template,
  styles: [style]
})
export class DashboardComponent {
  public Category = Category;
}
