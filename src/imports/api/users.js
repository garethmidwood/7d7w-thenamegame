import { Meteor } from 'meteor/meteor';

/*
  This basically just adds some extra data to the `Meteor.users` collection
*/
if (Meteor.isServer) {
  Meteor.publish('userstatus', function userStatusPublication() {
    return Meteor.users.find({ }, { fields: { "status.online": true, "username": true }});
  });
}

Meteor.methods({});