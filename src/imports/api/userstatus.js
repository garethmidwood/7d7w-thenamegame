import { Meteor } from 'meteor/meteor';


if (Meteor.isServer) {
  console.log('THE SERVER IS PUBLISHING USER STATUS');
  Meteor.publish('userstatus', function userStatusPublication() {
    return Meteor.users.find({ }, { fields: { "status.online": true, "username": true }});
  });
}

Meteor.methods({});