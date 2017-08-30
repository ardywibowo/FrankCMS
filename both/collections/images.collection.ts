import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';
import { UploadFS } from 'meteor/jalik:ufs';
import { Thumb, Image } from "../models/image.model";

export const Images = new MongoObservable.Collection<Image>('images');
export const Thumbs = new MongoObservable.Collection<Thumb>('thumbs');

function loggedIn() {
  // return true;
  return !!Meteor.user();
}

export const ThumbsStore = new UploadFS.store.GridFS({
  collection: Thumbs.collection,
  name: 'thumbs',
  permissions: new UploadFS.StorePermissions({
    insert: loggedIn,
    update: loggedIn,
    remove: loggedIn
  }),
  transformWrite: function (from, to, fileId, file) {
    let gm = Npm.require('gm');
    if (gm) {
      gm(from)
        .resize(100, 100)
        .gravity('Center')
        .extent(100, 100)
        .quality(80)
        .stream().pipe(to);
    } else {
      console.error("gm is not available", file);
    }
  }
});

export const ImagesStore = new UploadFS.store.GridFS({
  collection: Images.collection,
  name: 'images',
  filter: new UploadFS.Filter({
    contentTypes: ['image/*']
  }),
  copyTo: [
    ThumbsStore
  ],
  permissions: new UploadFS.StorePermissions({
    insert: loggedIn,
    update: loggedIn,
    remove: loggedIn
  })
});

Images.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});
