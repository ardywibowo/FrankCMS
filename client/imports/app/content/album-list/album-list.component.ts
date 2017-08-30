import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { Observable, Subscription, Subject } from "rxjs";
import { MeteorObservable } from "meteor-rxjs";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaginationService } from 'ng2-pagination';
import { MdSnackBar } from '@angular/material';

import { Artwork, Category } from './../../../../../both/models/artwork.model';
import { Artworks } from './../../../../../both/collections/artworks.collection';

import { Album } from './../../../../../both/models/album.model';
import { Albums } from './../../../../../both/collections/albums.collection';
import { Counts } from "meteor/tmeasday:publish-counts";

import { ArtworksList } from './../../shared-components/artworks-list.class';

import template from './album-list.component.html';
import style from './album-list.component.scss';

@Component({
  selector: 'album-list',
  template,
  styles: [style]
})
export class AlbumListComponent extends ArtworksList implements OnInit {
  public Category = Category;

  albums: Observable<Album[]>;
  albumsSubs: Subscription;

  expandedIndex: number = null;
  updateForm: FormGroup;

  showSelectionModal: boolean = false;
  selectionCategory: Category;

  showRemovalModal: boolean = false;
  selectedAlbum: Album;

  showCoverArtModal: boolean = false;
  coverArt: Artwork;

  @Input() isEditing: boolean = false;
  @Input() category: Category = Category.Any;
  @Input() showPrivate: Boolean = false;

  constructor (private formBuilder: FormBuilder, paginationService: PaginationService, snackBar: MdSnackBar) { 
    super(paginationService, snackBar);
  }

  ngOnInit() {
    super.ngOnInit();
    this.albumsSubs = MeteorObservable.subscribe('albums').subscribe(() => {
      let albumSelector: any;
      if (this.category == Category.Any) {
        albumSelector = {};
      } else {
        albumSelector = {category: this.category};
      }

      if(!this.showPrivate) {
        albumSelector.private = false;
      }
      
      this.albums = Albums.find(albumSelector, {
        sort: {
          "creationDate": -1
        }
      });
    });

    this.updateForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      category: [''],
      private: ['']
    });

  }

  refreshUpdateForm(album: Album) {
    this.updateForm = this.formBuilder.group({
      name: [album.name, Validators.required],
      description: [album.description],
      category: [album.category],
      private: [album.private]
    });
  }

  ngOnDestroy() {
    if (this.albumsSubs) {
      this.albumsSubs.unsubscribe();
    }
  }

  albumClicked(album: Album, index: number, target: any) {
    this.selectedAlbum = album;
    if(this.expandedIndex == index) {
      this.expandedIndex = null;
    } else {
      this.expandedIndex = index;

      this.refreshUpdateForm(album);
    }
    target.scrollIntoView();
  }

  selectCoverArt(album: Album) {
    this.selectedAlbum = album;
    this.selectionCategory = album.category;
    this.showCoverArtModal = true;
  }

  addArtworkToAlbum(album: Album) {
    this.selectedAlbum = album;
    this.selectionCategory = album.category;
    this.showSelectionModal = true;
  }

  removeArtworkFromAlbum(album: Album) {
    this.selectedAlbum = album;
    this.showRemovalModal = true;
  }

  setCoverArt(selectedArtworks: string[]) {
    if (!Meteor.userId()) {
      this.snackBar.open('Please log in to set the cover art', 'Close');
      return;
    }

    Albums.update(this.selectedAlbum._id, {
      $set: {
        coverArt: selectedArtworks[0]
      }
    });
    this.closeSelection();
  }

  addToAlbum(selectedArtworks: string[]) {
    if (!Meteor.userId()) {
      this.snackBar.open('Please log in to artworks to album', 'Close');
      return;
    }

    Albums.update(this.selectedAlbum._id, {
      $set: {
        artworks: [...this.selectedAlbum.artworks, ...selectedArtworks]
      }
    });
    this.closeSelection();
  }

  removeFromAlbum(selectedArtworks: string[]) {
    if (!Meteor.userId()) {
      this.snackBar.open('Please log in to remove artworks from album', 'Close');
      return;
    }
    for (let artworkId of selectedArtworks) {
      Albums.update(this.selectedAlbum._id,
        { $pull: { artworks: artworkId } }
      );
    }

    let albumArtworks: Album = Albums.findOne(this.selectedAlbum._id, { fields: { coverArt: 1, artworks: 1 } });
    if (albumArtworks.artworks.length == 0) {
      Albums.remove(albumArtworks._id);
      this.closeSelection();
      return;
    }

    if (selectedArtworks.indexOf(albumArtworks.coverArt) > -1) {
      Albums.update(this.selectedAlbum._id, {
        $set: {
          coverArt: this.selectedAlbum.artworks[0]
        }
      });
    }
    this.closeSelection();
  }

  removeAlbum(album: Album) {
    if (!Meteor.userId()) {
      this.snackBar.open('Please log in to remove album', 'Close');
      return;
    }

    if (album.artworks != null) {
      for (let artwork of album.artworks) {
        Artworks.update(artwork, {
          $pull: {
            albumsIn: album._id
          }
        });
      }
    }
    Albums.remove(album._id);
  }

  updateAlbum(album: Album): void {
    if (!Meteor.userId()) {
      this.snackBar.open('Please log in to update the album', 'Close');
      return;
    }

    if(!this.updateForm.valid) {
      this.snackBar.open('Please fill in all fields to create your album', 'Close');
      return;
    }

    let categoryUpdate = this.updateForm.value.category;
    if (this.updateForm.value.category == null) {
      categoryUpdate = album.category;
    }

    Albums.update(album._id, {
      $set: {
        name: this.updateForm.value.name,
        description: this.updateForm.value.description,
        private: this.updateForm.value.private,
        category: categoryUpdate
      }
    });
  }

  closeSelection() {
    this.showSelectionModal = false;
    this.showRemovalModal = false;
    this.showCoverArtModal = false;
  }

  closeGallery() {
    this.expandedIndex = null;
  }
}
