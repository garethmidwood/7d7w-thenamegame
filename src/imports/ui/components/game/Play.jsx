import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Tasks } from '../../../api/tasks.js';
import Task from '../../entities/Task.jsx';

import Countdown from './Countdown.jsx';

import { GameConfigs } from '../../../api/gameconfig.js';

class Play extends Component {
  handlePass(event) {
    event.preventDefault();
 
    console.log('passed');

    Meteor.call('gameconfig.pass');
  }

  handleNext(event) {
    event.preventDefault();
    
    console.log('pressed next');

    Meteor.call('gameconfig.next');
  }

  handleCancel(event) {
    event.preventDefault();
    
    if (!this.props.isAdmin) {
      return;
    }

    console.log('cancelling this turn');

    Meteor.call('gameconfig.cancel');
  }

  handleStop(event) {
    event.preventDefault();
    
    if (!this.props.isAdmin) {
      return;
    }

    console.log('stopping this game');

    Meteor.call('gameconfig.stop');
  }

  handleControlFormSubmit(event) {
    event.preventDefault();

    return false;
  }

  renderAdminControls() {
    return (
      <div id="game-screen">
        <form className="game-controls admin-controls" onSubmit={this.handleControlFormSubmit.bind(this)}>
          <button onClick={this.handleStop.bind(this)}>Cancel this turn</button>
        </form>
      </div>
    );    
  }

  renderYourePlaying() {
    return (
      <div id="game-screen">
        <h1>You're playing, and the name is...</h1>

        <span ref="gameMessagePassed" id="game-message-passed">
          <span>Passed!</span>
        </span>

        <span id="name-in-play">
          <span>
            {this.props.activeName.value && this.props.activeName.value.name
             ? this.props.activeName.value.name
             : 'hold on...' }
          </span>
        </span>
        
        <Countdown />

        <p>{this.props.numberOfRemainingNames} names left in play</p>

        <form className="game-controls play-controls" onSubmit={this.handleControlFormSubmit.bind(this)}>
          <button ref="passButton" onClick={this.handlePass.bind(this)}>Pass</button>
          <button ref="nextButton" onClick={this.handleNext.bind(this)}>Got it</button>
        </form>
      </div>
    );
  }

  renderSomeoneElsePlaying() {
    return (
      <div>
        <h1>Game on!</h1>
        
        <Countdown />

        <p>{this.props.numberOfRemainingNames} names left in play</p>

        { this.props.activePlayer.value && this.props.activePlayer.value.username
          ? <h2>{this.props.activePlayer.value.username} is playing</h2>
          : '' }
      </div>
    );   
  }

  render() { 
    return (
        <div>
          { this.props.yourePlaying ?
            this.renderYourePlaying() :
            this.renderSomeoneElsePlaying()
          }

          {this.props.isAdmin
          ? this.renderAdminControls()
          : ''}

        </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('tasks');
  Meteor.subscribe('gameconfig');

  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user(),
    numberOfRemainingNames: GameConfigs.findOne('currentRound').namesToPlay.length,
    activePlayer: GameConfigs.findOne("activePlayer"),
    currentPlayerEndTime: GameConfigs.findOne("playerTurnCompleteTime"),
    yourePlaying: ( Meteor.user() && GameConfigs.findOne("activePlayer").value && GameConfigs.findOne("activePlayer").value.username ==  Meteor.user().username),
    isAdmin: (Meteor.user() && Meteor.user().username == 'gmidwood'),
    activeName: GameConfigs.findOne("activeName"),
  };
})(Play);