import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Albums } from '../../../both/collections/albums.collection';

interface Options {
  [key: string]: any;
}

Meteor.publish('albums', function(options: Options, name?: string) {
  const selector = buildQuery.call(this, null, name);

  Counts.publish(this, 'numberOfAlbums', Albums.collection.find(selector), { noReady: true });

  return Albums.find(selector, options);
});

Meteor.publish('album', function(albumId: string) {
  return Albums.find(buildQuery.call(this, albumId));
});

function buildQuery(albumId?: string, name?: string): Object {
  const isAvailable = {
    $or: [{ private: false }, { private: (this.userId != null) }]
  };

  if (albumId) {
    return {
      // only single album
      $and: [{
          _id: albumId
        },
        isAvailable
      ]
    };
  }

  const searchRegEx = { '$regex': '.*' + (name || '') + '.*', '$options': 'i' };

  return {
    $and: [{
        'name': searchRegEx
      },
      isAvailable
    ]
  };
}
