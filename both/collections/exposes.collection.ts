import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';

import { Expose } from '../models/expose.model';

export const Exposes = new MongoObservable.Collection<Expose>('exposes');

function loggedIn() {
  // return true;
  return !!Meteor.user();
}

Exposes.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});
