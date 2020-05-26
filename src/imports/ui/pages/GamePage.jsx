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

    if (!this.props.isAdmin) {
      return;
    }

    console.log('stopping this game');
 
    Meteor.call('gameconfig.stop');
  }

  renderGameInPlay() {
    return (
      <div>
        <Play />
      </div>
    );
  }

  renderGameControls() {
    return (
      <form className="start-game game-controls play-controls" onSubmit={this.handleStartGame.bind(this)} >
        <button>Start your turn</button>
      </form>
    );
  }

  renderAdminControls() {
    return (
      <form className="game-controls" onSubmit={this.handleStopGame.bind(this)} >
        <button>stop this game</button>
      </form>
    );
  }

  renderGameStopped() {
    return (
      <div id="game-wrapper">
        <div id="game-screen-stopped">

          <h1>The Name Game</h1>

          { this.props.gameStarted 
           ? ''
           : <AccountsUIWrapper />
          }

          { this.props.gameStarted 
           ? ''
           : <AddNames />
          }

          {this.renderGameControls()}
        </div>

        <div id="game-screen-user-list">
          <OnlineUsers />
        </div>

        { this.props.isAdmin 
          ? this.renderAdminControls()
          : ''
        }
      </div>
    );
  }
 
  render() {
    return (
      <div className="container">
        { this.props.gameInProgress && this.props.gameInProgress.value ?
            this.renderGameInPlay() :
            this.renderGameStopped()
          }
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('gameconfig');

  return {
    gameconfig: GameConfigs.find({}).fetch(),
    gameInProgress: GameConfigs.findOne("inProgress"),
    gameStarted: (GameConfigs.findOne('currentRound') && GameConfigs.findOne('currentRound').usersToPlay.length > 0),
    gameCurrentRound: GameConfigs.findOne("currentRound"),
    currentUser: Meteor.user(),
    isAdmin: (Meteor.user() && Meteor.user().username == 'gmidwood')
  };
})(GamePage);