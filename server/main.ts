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
  process.env.MAIL_URL = 'smtp://postmaster%40sandbox8614cb880bbc4c6480976550a1329fae.mailgun.org:22e22763c4ef9f5c4feb66c33bc222bd@smtp.mailgun.org:587';

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

