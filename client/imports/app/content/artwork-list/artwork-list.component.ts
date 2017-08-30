import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from 'meteor-rxjs';
import { PaginationService } from 'ng2-pagination';

import { Artworks } from '../../../../../both/collections/artworks.collection';
import { Artwork, Category } from '../../../../../both/models/artwork.model';
import { Images } from '../../../../../both/collections/images.collection';

import { DisplayMainImagePipe } from '../../shared/display-main-image.pipe';

import { ArtworkGridComponent } from '../../artwork-grid/artwork-grid.component';

import template from './artwork-list.component.html';
import style from './artwork-list.component.scss';

@Component({
  selector: 'artwork-list',
  template,
  styles: [style]
})
export class ArtworkListComponent implements OnInit, OnDestroy {
  @ViewChild(ArtworkGridComponent) gridChild: ArtworkGridComponent;
  @Input() category: Category = Category.Any;
  
  public Category = Category;
  
  imagesSubs: Subscription;

  artworksSub: Subscription;
  featuredArt: Artwork;
  featuredArtURL : string;

  ngOnInit() {
    this.imagesSubs = MeteorObservable.subscribe('images').subscribe();

    this.artworksSub = MeteorObservable.subscribe('artworks').subscribe(() => {
      let selector: any = {private: false};
      if (this.category != Category.Any) {
        selector = { private: false, category: this.category }
      }

      this.featuredArt = Artworks.findOne(selector, {
        sort: {
          "uploadDate": -1
        }
      });

      this.featuredArtURL = new DisplayMainImagePipe().transform(this.featuredArt);
    });
  }

  featuredArtClicked() {
    this.gridChild.tileClicked(0, this.featuredArt._id);
  }

  // Grid list column change
  colNum: number = 4;
  onResize(event) {
    if(event.target.innerWidth < 1000) {
      this.colNum = 2;
    } else {
      this.colNum = 4;
    }
  }

  ngOnDestroy() {
    this.imagesSubs.unsubscribe();
    this.artworksSub.unsubscribe();
  }
}
