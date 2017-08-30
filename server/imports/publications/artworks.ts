import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Artworks } from '../../../both/collections/artworks.collection';

interface Options {
  [key: string]: any;
}

Meteor.publish('artworks', function(options: Options, name?: string, inputSelector?: any) {
  const selector = buildQuery.call(this, null, name);

  const isAvailable = {
    $or: [{ private: false }, { private: (this.userId != null) }]
  };
  inputSelector = {
    $and: [ inputSelector, isAvailable ]
  };

  Counts.publish(this, 'numberOfArtworks', Artworks.collection.find(inputSelector), { noReady: true });

  return Artworks.find(selector, options);
});

Meteor.publish('artwork', function(artworkId: string) {
  return Artworks.find(buildQuery.call(this, artworkId));
});

function buildQuery(artworkId?: string, name?: string): Object {
  const isAvailable = {
    $or: [{ private: false }, { private: (this.userId != null) }]
  };

  if (artworkId) {
    return {
      // only single album
      $and: [{
          _id: artworkId
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
