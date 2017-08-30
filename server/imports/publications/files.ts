import { Meteor } from 'meteor/meteor';
import { Files } from '../../../both/collections/files.collection';

Meteor.publish('files', function() {
  return Files.collection.find({});
});
