import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';
import { UploadFS } from 'meteor/jalik:ufs';
import { File } from "../models/file.model";

export const Files = new MongoObservable.Collection<File>('files');

function loggedIn() {
  // return true;
  return !!Meteor.user();
}

export const FilesStore = new UploadFS.store.GridFS({
  collection: Files.collection,
  name: 'files',
  permissions: new UploadFS.StorePermissions({
    insert: loggedIn,
    update: loggedIn,
    remove: loggedIn
  })
});

Files.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});
