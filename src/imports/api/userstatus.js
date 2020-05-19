import { Meteor } from 'meteor/meteor';


if (Meteor.isServer) {
  Meteor.publish('userstatus', function userStatusPublication() {
    return Meteor.users.find({ }, { fields: { "status.online": true, "username": true }});
  });
}

Meteor.methods({});