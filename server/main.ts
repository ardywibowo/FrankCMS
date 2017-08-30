import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { Random } from 'meteor/random';
import { Accounts } from 'meteor/accounts-base';

import './imports/publications/artworks';
import './imports/publications/images';
import './imports/publications/album';
import './imports/publications/files';
import './imports/publications/exposes';

Meteor.startup(() => {
  process.env.MAIL_URL = '<insert mail service URL>';

  Accounts.urls.resetPassword = function(token) {
    return Meteor.absoluteUrl('reset-password/' + token);
  };

  if (Meteor.users.find({}).count() < 1) {
    // Create user account
    let loginEmail = 'email@test.com';
    let tempPassword = 'testpassword';

    Accounts.createUser({
      email: loginEmail,
      password: tempPassword
    });
  }
});

