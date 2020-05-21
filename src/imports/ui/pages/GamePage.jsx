import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
 
import { GameConfigs } from '../../api/gameconfig.js';

import AccountsUIWrapper from '../components/AccountsUIWrapper.jsx';
import OnlineUsers from '../components/OnlineUsers.jsx';
import AddNames from '../components/game/AddNames.jsx';
import Play from '../components/game/Play.jsx';


class GamePage extends Component {
  handleStartGame(event) {
    event.preventDefault();
 
    Meteor.call('gameconfig.start');
  }

  handleStopGame(event) {
    event.preventDefault();
 
    Meteor.call('gameconfig.stop');
  }

  renderGameInPlay() {
    return (
      <div>
        <form className="stop-game game-controls " onSubmit={this.handleStopGame.bind(this)} >
          <button>Stop the game</button>
        </form>

        <Play />
      </div>
    );
  }

  renderGameStopped() {
    return (
      <div>
        <AccountsUIWrapper />

        <OnlineUsers />

        <form className="start-game game-controls " onSubmit={this.handleStartGame.bind(this)} >
          <button>Start the game</button>
        </form>

        <AddNames />
      </div>
    );
  }
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>The Name Game</h1>
 
          { this.props.gameInProgress && this.props.gameInProgress.value ?
            this.renderGameInPlay() :
            this.renderGameStopped()
          }
        </header>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('gameconfig');

  return {
    gameconfig: GameConfigs.find({}).fetch(),
    gameInProgress: GameConfigs.findOne("inProgress"),
    gameCurrentRound: GameConfigs.findOne("currentRound"),
    currentUser: Meteor.user()
  };
})(GamePage);