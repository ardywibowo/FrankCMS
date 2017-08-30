import { Component, OnInit, OnDestroy } from '@angular/core';

import { Artwork } from '../../../../../../both/models/artwork.model';
import { Artworks } from '../../../../../../both/collections/artworks.collection';
import { Expose } from '../../../../../../both/models/expose.model';
import { Exposes } from '../../../../../../both/collections/exposes.collection';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from 'meteor-rxjs';

import { Category } from '../../../../../../both/models/artwork.model';

import template from './section-list.component.html';
import style from './section-list.component.scss';

@Component({
  selector: 'section-list',
  template,
  styles: [style]
})
export class SectionListComponent implements OnInit, OnDestroy { 

  photographyDescription: string = '';
  photographyCover: Artwork;

  sculptureDescription: string = '';
  sculptureCover: Artwork;

  travelDescription: string = '';
  travelCover: Artwork;

  writingDescription: string = '';
  writingCover: Artwork;

  exposesSub: Subscription;
  artworksSub: Subscription;

  ngOnInit() {
    this.exposesSub = MeteorObservable.subscribe('exposes').subscribe(() => {

      let photographyExpose = Exposes.findOne({category: Category.Photography});
      let sculptureExpose = Exposes.findOne({category: Category.Sculpture});
      let travelExpose = Exposes.findOne({category: Category.Travels});
      let writingExpose = Exposes.findOne({category: Category.Writing});

      this.photographyDescription = photographyExpose.description;
      this.sculptureDescription = sculptureExpose.description;
      this.travelDescription = travelExpose.description;
      this.writingDescription = writingExpose.description;

      this.artworksSub = MeteorObservable.subscribe('artworks').subscribe(() => {
        console.log(photographyExpose._id);
        this.photographyCover = Artworks.findOne(photographyExpose.coverArt);
        this.sculptureCover = Artworks.findOne(sculptureExpose.coverArt);
        this.travelCover = Artworks.findOne(travelExpose.coverArt);
        this.writingCover = Artworks.findOne(writingExpose.coverArt);

        console.log(this.photographyCover);
      });
    });
  }

  ngOnDestroy() {
    this.exposesSub.unsubscribe();
    this.artworksSub.unsubscribe();
  }

}
