import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';

import { Album } from '../models/album.model';

export const Albums = new MongoObservable.Collection<Album>('albums');

function loggedIn() {
  // return true;
  return !!Meteor.user();
}

Albums.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});
