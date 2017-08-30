import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { PaginationService } from 'ng2-pagination';
import { ArtworksList } from '../shared-components/artworks-list.class';
import { MdSnackBar } from '@angular/material';

import { Artwork } from '../../../../both/models/artwork.model';

import template from './artwork-grid.component.html';
import style from './artwork-grid.component.scss';

@Component({
  selector: 'artwork-grid',
  template,
  styles: [style]
})
export class ArtworkGridComponent extends ArtworksList {
  @Input() columnAmount: number;
  @Input() isEditing: boolean;
  @Input() isSelecting: boolean;
  @Input() isExpose: boolean;

  selectedArtworks: string[] = [];
  modalOpened: boolean = false;
  artworkPointer: number = 0;
  
  constructor(paginationService: PaginationService, snackBar: MdSnackBar) {
    super(paginationService, snackBar);
  }

  tileClicked(artworkPointer: number, artworkId: string) {
    if (this.isSelecting) {
      let index = this.selectedArtworks.indexOf(artworkId);
      if (index > -1) {
        this.selectedArtworks.splice(index, 1);
      } else {
        this.selectedArtworks.push(artworkId);
      }
    } else {
      this.presentModal(artworkPointer);
    }
  }

  presentModal(artworkPointer: number) {
    this.modalOpened = true;
    this.artworkPointer = artworkPointer;
  }
  closeModal() {
    this.modalOpened = false;
  }
}
