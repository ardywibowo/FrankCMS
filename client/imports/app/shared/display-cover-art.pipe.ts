import {Pipe, PipeTransform, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from "meteor-rxjs";

import { Images } from '../../../../both/collections/images.collection';
import { Artwork } from '../../../../both/models/artwork.model';
import { Artworks } from '../../../../both/collections/artworks.collection';
import { Album } from '../../../../both/models/album.model';

import { Meteor } from "meteor/meteor";

@Pipe({
  name: 'displayCoverArt'
})
export class DisplayCoverArtPipe implements PipeTransform {

  transform(album: Album) {
    if (!album) {
      return;
    }

    let artwork: Artwork = Artworks.findOne(album.coverArt);
    let imageId: string = (artwork.images || [])[0];

    const coverImage = Images.findOne(imageId);

    let imageUrl: string;
    if (coverImage) {
      if (!Meteor.isCordova) {
        imageUrl = coverImage.url;
      } else {
        const path = `ufs/${coverImage.store}/${coverImage._id}/${coverImage.name}`;
        imageUrl = Meteor.absoluteUrl(path);
      }
    } else {
      imageUrl = 'images/coverart-placeholder.jpeg';
    }

    return imageUrl;
  }
}
