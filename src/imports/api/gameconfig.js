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

  // tells us whose turn it is
  GameConfigs.insert({
    _id: 'activePlayer',
    value: null
  });

  // tells us which name is being guessed currently
  GameConfigs.insert({
    _id: 'activeName',
    value: null
  });

  // tells us when current players time will end
  GameConfigs.insert({
    _id: 'playerTurnCompleteTime',
    value: null
  });

  // add config for this round
  GameConfigs.insert({
    _id: 'currentRound',
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
  startTurnTimer() {
    var endTime = new Date();
    endTime.setSeconds(endTime.getSeconds() + 300);
    GameConfigs.update('playerTurnCompleteTime', { $set: { value: endTime.toISOString() } });
  },



  chooseNextNameToPlay() {
    if (!Meteor.isServer) {
      return;
    }

    var namesStillToPlay = GameConfigs.findOne('currentRound').namesToPlay;

    if (namesStillToPlay.length == 0) {
      return;
    }

    // randomly pick next name from those remaining
    var randomIndex = Math.floor( Math.random() * namesStillToPlay.length );
    var chosenName = namesStillToPlay[randomIndex];
 
    console.log('setting next name to ', chosenName.name);
    GameConfigs.update('activeName', { $set: { value: chosenName } });
  },
  removeCurrentNameFromToPlayList() {
    // remove current player from usersToPlay list
    var namesStillToPlay = GameConfigs.findOne('currentRound').namesToPlay;
    var nameBeingRemoved = GameConfigs.findOne('activeName').value;

    // remove the name from the array
    var newNamesStillToPlay = namesStillToPlay.filter(
      function(value, index, arr) { return nameBeingRemoved._id != value._id; }
    );

    // set new usersToPlay array without this player
    GameConfigs.update(
      'currentRound',
      { $set: { namesToPlay: newNamesStillToPlay } }
    );

    // if there's nobody left to play then stop the round
    if (newNamesStillToPlay.length == 0) {
      this.roundOver();
    }    
  },
  chooseNextPlayerToPlay(userId) {
    if (!Meteor.isServer) {
      return;
    }

    var playersStillToPlay = GameConfigs.findOne('currentRound').usersToPlay;

    if (playersStillToPlay.length == 0) {
      return;
    }

    if (userId) {
      var nextPlayer = Meteor.users.findOne(userId);
    } else {
      // randomly pick next player from those remaining
      var randomIndex = Math.floor( Math.random() * playersStillToPlay.length );
      var chosenPlayer = playersStillToPlay[randomIndex];
      var nextPlayer = Meteor.users.findOne(chosenPlayer._id);
    }
 
    console.log('setting next player to ', nextPlayer.username);
    GameConfigs.update('activePlayer', { $set: { value: nextPlayer } });
  },
  removeCurrentPlayerFromToPlayList() {
    // remove current player from usersToPlay list
    var playersStillToPlay = GameConfigs.findOne('currentRound').usersToPlay;
    var playerCompletingTurn = GameConfigs.findOne('activePlayer').value;

    // remove the person who just played from the array
    var newPlayersStillToPlay = playersStillToPlay.filter(
      function(value, index, arr) { return playerCompletingTurn._id != value._id; }
    );

    // set new usersToPlay array without this player
    GameConfigs.update(
      'currentRound',
      { $set: { usersToPlay: newPlayersStillToPlay } }
    );

    // if there's nobody left to play then fill the list up with all players
    if (newPlayersStillToPlay.length == 0) {
      var allUsers = this.getFullOnlineUserList();

      GameConfigs.update(
        'currentRound',
        { $set: { usersToPlay: allUsers } }
      );
    }
  },


  getFullOnlineUserList() {
    let onlineUsers = [];
    Meteor.users.find({ 'status.online': true }).fetch().forEach(element => {
      onlineUsers.push({
        '_id': element._id,
        'name': element.username
      });
    });

    return onlineUsers;
  },
  getFullNamesList() {
    let nameList = [];
    Tasks.find().fetch().forEach(element => {
      nameList.push({
        '_id': element._id,
        'name': element.text
      });
    });

    return nameList;
  },


  gameInProgress() {
    // if there are users playing then we assume we've started
    return GameConfigs.findOne('currentRound').usersToPlay.length > 0;
  },
  prepareCurrentRoundConfig() {
    // round over will reset the round config
    this.roundOver();
  },
  roundOver() {
    GameConfigs.update('inProgress', { $set: { value: false } });

    var allUsers = this.getFullOnlineUserList();
    var allNames = this.getFullNamesList();

    GameConfigs.update(
      'currentRound',
      { $set: { usersToPlay: allUsers, namesToPlay: allNames } }
    );
  },
  gameOver() {
    GameConfigs.update('inProgress', { $set: { value: false } });
    GameConfigs.update('activePlayer', { $set: { value: null } });
    GameConfigs.update('activeName', { $set: { value: null } });
    GameConfigs.update('playerTurnCompleteTime', { $set: { value: null } });
    GameConfigs.update(
      'currentRound',
      { $set: { usersToPlay: [], namesToPlay: [] } }
    );

    // remove all the names too
    Tasks.remove({});
  }
};
 

Meteor.methods({
    'gameconfig.start'() {
      // Make sure the user is logged in before letting them start the game
      if (!this.userId) {
        throw new Meteor.Error('not-authorized');
      }
    
      if (!gameConfigFuncs.gameInProgress()) {
        gameConfigFuncs.prepareCurrentRoundConfig();
      }

      console.log('about to choose the next player');
      gameConfigFuncs.chooseNextPlayerToPlay(this.userId);

      console.log('about to choose the next name to play');
      gameConfigFuncs.chooseNextNameToPlay();

      GameConfigs.update('inProgress', { $set: { value: true } });
    },
    'gameconfig.cancel'() {
      // Make sure the user is logged in before letting them cancel this turn
      if (!this.userId) {
        throw new Meteor.Error('not-authorized');
      }
  
      GameConfigs.update('inProgress', { $set: { value: false } });
    },
    'gameconfig.stop'() {
      // Make sure the user is logged in before letting them stop the game
      if (!this.userId) {
        throw new Meteor.Error('not-authorized');
      }
  
      gameConfigFuncs.gameOver();
    },
    'gameconfig.pass'() {
      var currentPlayer = GameConfigs.findOne("activePlayer");
      // Make sure this user is the one playing
      if (!this.userId || this.userId != currentPlayer.value._id) {
        throw new Meteor.Error('not-authorized');
      }
  
      gameConfigFuncs.chooseNextNameToPlay();
    },
    'gameconfig.next'() {
      var currentPlayer = GameConfigs.findOne("activePlayer");
      // Make sure this user is the one playing
      if (!this.userId || this.userId != currentPlayer.value._id) {
        throw new Meteor.Error('not-authorized');
      }

      gameConfigFuncs.removeCurrentNameFromToPlayList();
      gameConfigFuncs.chooseNextNameToPlay();
    },
    'gameconfig.turnOver'() {
      var currentPlayer = GameConfigs.findOne("activePlayer");
      // Make sure this user is the one playing
      if (!this.userId || this.userId != currentPlayer.value._id) {
        throw new Meteor.Error('not-authorized ' + this.userId + ' != ' + currentPlayer.value._id);
      }

      gameConfigFuncs.removeCurrentPlayerFromToPlayList();
      // gameConfigFuncs.chooseNextPlayerToPlay();

      GameConfigs.update('inProgress', { $set: { value: false } });
    }
  });