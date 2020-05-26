import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { GameConfigs } from '../../../api/gameconfig.js';

import CountdownTimer from "react-component-countdown-timer";

class Countdown extends Component {

    render() {
        var theEndTime = new Date(this.props.currentPlayerEndTime.value);
        var currentTime = new Date();

        const diffTime = Math.abs(currentTime.getTime() - theEndTime.getTime());
        console.log('working out the remaining time in ui/components/game/Countdown.jsx');
        console.log(diffTime);

        var yourePlaying = this.props.yourePlaying;

        var settings = {
            count: 30,
            border: true,
            showTitle: true,
            noPoints: true,
            hideDay: true,
            hideHours: true,
            labelSize: 0,
            onEnd: function() {
                if (yourePlaying) {
                    console.log('my turn is over');
                    Meteor.call('gameconfig.turnOver');
                } else {
                    console.log('someone elses turn is over');
                }
            }
        };
        
        return (
            <div>
                <CountdownTimer {...settings} /> seconds left
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('gameconfig');

    return {
        yourePlaying: ( Meteor.user() && GameConfigs.findOne("activePlayer").value && GameConfigs.findOne("activePlayer").value.username ==  Meteor.user().username),
        currentPlayerEndTime: GameConfigs.findOne("playerTurnCompleteTime"),
    };
})(Countdown);