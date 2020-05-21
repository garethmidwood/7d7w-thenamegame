import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
import { Tasks } from './tasks.js';

export const GameConfigs = new Mongo.Collection('gameconfig');

if (Meteor.isServer) {
  // add default settings
  GameConfigs.remove({});

  // tells us if the game is running
  GameConfigs.insert({
    _id: 'inProgress',
    value: false
  });

  // tells us which round we're on
  GameConfigs.insert({
    _id: 'currentRound',
    value: 1
  });

  // tells us whose turn it is
  GameConfigs.insert({
    _id: 'activePlayer',
    value: null
  });

  // add configs for each of the rounds
  GameConfigs.insert({
    _id: 'round1',
    roundLabel: 'Describe',
    roundRules: 'Describe this person in any words (except their name!)',
    usersToPlay: [],
    usersPlayed: [],
    namesToPlay: [],
    namesPlayed: []
  });

  GameConfigs.insert({
    _id: 'round2',
    roundLabel: 'Acting',
    roundRules: 'Without using any words, act/pose as this person',
    usersToPlay: [],
    usersPlayed: [],
    namesToPlay: [],
    namesPlayed: []
  });

  GameConfigs.insert({
    _id: 'round3',
    roundLabel: 'Single Word',
    roundRules: 'You can say ONE word only',
    usersToPlay: [],
    usersPlayed: [],
    namesToPlay: [],
    namesPlayed: []
  });

  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('gameconfig', function tasksPublication() {
    return GameConfigs.find({});
  });
}


const gameConfigFuncs = {
  chooseNextPlayer() {
    var roundConfigKey = "round";
    currentRound = GameConfigs.findOne('currentRound');
    roundConfigKey += currentRound.value;

    console.log('choosing next player for ' + roundConfigKey);

    let thisRound = GameConfigs.findOne(roundConfigKey);
    var randomIndex = Math.floor( Math.random() * thisRound.usersToPlay.length );
    var chosenPerson = thisRound.usersToPlay[randomIndex];

    // choose who's going first
    GameConfigs.update('activePlayer', { $set: { value: chosenPerson } });
  }
};
 

Meteor.methods({
    'gameconfig.start'() {
      // Make sure the user is logged in before letting them start the game
      if (!this.userId) {
        throw new Meteor.Error('not-authorized');
      }

      GameConfigs.update('inProgress', { $set: { value: true } });
    
      // get a list of all the users that are currently online
      let onlineUsers = [];
      Meteor.users.find({ 'status.online': true }).fetch().forEach(element => {
        onlineUsers.push({
          '_id': element._id,
          'name': element.username
        });
      });

      // get a list of all of the names that have been added to the pot
      let nameList = [];
      Tasks.find().fetch().forEach(element => {
        nameList.push({
          '_id': element._id,
          'name': element.text
        });
      });

      GameConfigs.update('round1', { $set: { usersToPlay: onlineUsers, namesToPlay: nameList, usersPlayed: [], namesPlayed: [] } });
      GameConfigs.update('round2', { $set: { usersToPlay: onlineUsers, namesToPlay: nameList, usersPlayed: [], namesPlayed: [] } });
      GameConfigs.update('round3', { $set: { usersToPlay: onlineUsers, namesToPlay: nameList, usersPlayed: [], namesPlayed: [] } });

      gameConfigFuncs.chooseNextPlayer();
    },
    'gameconfig.stop'() {
      // Make sure the user is logged in before letting them start the game
      if (! this.userId) {
        throw new Meteor.Error('not-authorized');
      }
  
      GameConfigs.update('inProgress', { $set: { value: false } });
    },
    'gameconfig.pass'() {
      // Make sure this user is the one playing
      if (! this.userId) {
        throw new Meteor.Error('not-authorized');
      }
  
      GameConfigs.update('inProgress', { $set: { value: false } });
    },
    'gameconfig.next'() {
      // Make sure this user is the one playing
      if (! this.userId) {
        throw new Meteor.Error('not-authorized');
      }
  
      GameConfigs.update('inProgress', { $set: { value: false } });
    }
  });