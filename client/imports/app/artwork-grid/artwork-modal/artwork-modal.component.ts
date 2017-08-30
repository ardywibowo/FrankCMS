import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PaginationService } from 'ng2-pagination';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';

import { Artwork, Category } from '../../../../../both/models/artwork.model';

import template from './artwork-modal.component.html';
import style from './artwork-modal.component.scss';

@Component({
  selector: 'artwork-modal',
  template,
  styles: [style],
  providers: [MdSnackBar]
})
export class ArtworkModalComponent implements OnInit {
  @Input() artworks: Artwork[];
  @Input() artworkPointer: number;
  @Input() isEditing: boolean;
  @Output() onClose = new EventEmitter<any>();
  @Output() onRemove = new EventEmitter<Artwork>();
  @Output() onSave = new EventEmitter<Artwork>();

  currentArt: Artwork;
  currentImageIndex: number;

  loading: boolean = false;

  updateForm: FormGroup;

  constructor (private formBuilder: FormBuilder, private snackBar: MdSnackBar) { }

  ngOnInit() {
    this.loading = true;
    if (this.artworkPointer >= 0) {
      this.openGallery(this.artworkPointer);
    }

    this.refreshUpdateForm();
  }

  closeGallery() {
    this.onClose.emit(null);
  }

  refreshUpdateForm() {
    this.updateForm = this.formBuilder.group({
      name: [this.currentArt.name, Validators.required],
      description: [this.currentArt.description],
      category: [this.currentArt.category],
      private: [this.currentArt.private]
    });
  }

  prevImage() {
    this.loading = true;
    this.currentImageIndex--;
    if (this.currentImageIndex < 0) {
      this.currentImageIndex = this.artworks.length - 1;
    }
    this.openGallery(this.currentImageIndex);
  }

  nextImage() {
    this.loading = true;
    this.currentImageIndex++;
    if (this.artworks.length === this.currentImageIndex) {
      this.currentImageIndex = 0;
    }
    this.openGallery(this.currentImageIndex);
  }

  openGallery(index) {
    if (!index) {
      this.currentImageIndex = 1;
    }
    this.currentImageIndex = index;
    for (var i = 0; i < this.artworks.length; i++) {
      if (i === this.currentImageIndex) {
        this.currentArt = this.artworks[i];
        this.loading = false;
        break;
      }
    }
    this.refreshUpdateForm();
  }

  removeArtwork(artwork: Artwork): void {
    if (this.artworks.length == this.currentImageIndex && this.artworks.length != 1) {
      this.prevImage();
    } else if (this.artworks.length == 1) {
      this.closeGallery();
    } else {
      this.nextImage();
    }
    this.onRemove.emit(artwork);
  }

  updateArtwork(): void {
    let updatedArtwork: Artwork = this.currentArt;
    
    if (!this.updateForm.valid) {
      this.snackBar.open('Please fill in all fields to update your artwork', 'Close');
      return;
    }

    updatedArtwork.name = this.updateForm.value.name;
    updatedArtwork.description = this.updateForm.value.description;
    updatedArtwork.private = this.updateForm.value.private;

    let categoryUpdate = this.updateForm.value.category;
    if (this.updateForm.value.category == null) {
      categoryUpdate = updatedArtwork.category;
    }
    updatedArtwork.category = categoryUpdate;

    this.onSave.emit(updatedArtwork);
  }
}
