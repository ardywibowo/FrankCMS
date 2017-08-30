import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Artwork } from '../../../../../both/models/artwork.model';

import template from './artwork-tile.component.html';
import style from './artwork-tile.component.scss';

@Component({
  selector: 'artwork-tile',
  template,
  styles: [style]
})
export class ArtworkTileComponent { 
  @Input() image: string;
  @Input () artwork: Artwork;
  @Input() selection: boolean;
  @Output() onClick = new EventEmitter();

  isSelected: boolean = false;

  imageSelected() {
    this.onClick.emit();
    this.isSelected = !this.isSelected;
  }
}
