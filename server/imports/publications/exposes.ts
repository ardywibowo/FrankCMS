import { Meteor } from 'meteor/meteor';

import { Exposes } from '../../../both/collections/exposes.collection';

Meteor.publish('exposes', function() {
  return Exposes.collection.find();
});
