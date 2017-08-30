import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';

import { Artwork } from '../models/artwork.model';

export const Artworks = new MongoObservable.Collection<Artwork>('artworks');

function loggedIn() {
  // return true;
  return !!Meteor.user();
}

Artworks.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});
