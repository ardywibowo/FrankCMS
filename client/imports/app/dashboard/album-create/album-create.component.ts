import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InjectUser } from "angular2-meteor-accounts-ui";
import { MdSnackBar } from '@angular/material';

import { Artwork, Category } from '../../../../../both/models/artwork.model';
import { Artworks } from '../../../../../both/collections/artworks.collection';
import { Albums } from '../../../../../both/collections/albums.collection';

import template from './album-create.component.html';
import style from './album-create.component.scss';

@Component({
  selector: 'album-create',
  template,
  styles: [style],
  providers: [MdSnackBar]
})
export class AlbumCreateComponent {
  createForm: FormGroup;

  selectionCategory: Category;
  createdAlbumId: string;
  showSelectionModal: boolean = false;

  constructor(
    private formBuilder: FormBuilder, private snackBar: MdSnackBar
  ) { }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      private: [false],
      category: [Category.Photography],
    });
  }

  createAlbum(): void {
    if (!Meteor.userId()) {
      this.snackBar.open('Please log in to create album', 'Close');
      return;
    }

    if (this.createForm.value.category == null || this.createForm.value.name == null || this.createForm.value.description == null) {
      this.snackBar.open('Please fill in all fields to create your album', 'Close');
      return;
    }

    if (this.createForm.valid) {
      this.selectionCategory = this.createForm.value.category;
      this.showSelectionModal = true;
    }
  }

  closeSelection() {
    this.showSelectionModal = false;
  }

  saveAlbum(selectedArtworks: string[]) {
    Albums.collection.insert({
      name: this.createForm.value.name,
      description: this.createForm.value.description,
      category: this.createForm.value.category,
      private: this.createForm.value.private,
      creationDate: new Date(),
      artworks: selectedArtworks,
      coverArt: selectedArtworks[0]
    }, function (err, albumId) {
      for (let artworkId of selectedArtworks) {
        Artworks.update(artworkId, {
          $push: {
            albumsIn: albumId
          }
        });
      }
    });

    this.createForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      private: [this.createForm.value.private],
      category: [this.createForm.value.category],
    });
  }
}
