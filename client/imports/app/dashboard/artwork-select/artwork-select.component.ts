import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { PaginationService } from 'ng2-pagination';
import { ArtworksList } from '../../shared-components/artworks-list.class';
import { Category } from '../../../../../both/models/artwork.model';
import { MdSnackBar } from '@angular/material';

import { ArtworkGridComponent } from './../../artwork-grid/artwork-grid.component';

import { Album } from './../../../../../both/models/album.model';
import { Albums } from './../../../../../both/collections/albums.collection';

import template from './artwork-select.component.html';
import style from './artwork-select.component.scss';

@Component({
  selector: 'artwork-select',
  template,
  styles: [style],
  providers: [MdSnackBar]
})
export class ArtworkSelectComponent {
  @ViewChild(ArtworkGridComponent) selectionGrid: ArtworkGridComponent;
  @Input() selectionCategory: Category;
  @Input() albumId: string;
  @Input() notInAlbumId: string;
  @Output() onFinish = new EventEmitter<string[]>();
  @Output() onCancel = new EventEmitter<any>();

  constructor(private snackBar: MdSnackBar) { }

  cancelSelection() {
    this.closeGallery();
  }

  finishSelection() {
    if (this.selectionGrid.selectedArtworks.length > 0) {
      this.onFinish.emit(this.selectionGrid.selectedArtworks);
      this.closeGallery();
    } else {
      this.snackBar.open('Please select at least one artwork', 'Close');
    }
  }

  closeGallery() {
    this.onCancel.emit(null);
  }
}
