import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { GameConfigs } from '../../../api/gameconfig.js';

import CountdownTimer from "react-component-countdown-timer";

class Countdown extends Component {

    render() {
        // the code below is hanging onto the previous end time on the CLIENT side,
        // so it's not picking up the correct 30 second allocation.
        // bodged it for the time being by hard coding 30 seconds in the countdown settings.

        // var theEndTime = this.props.currentPlayerEndTime.value;
        // var currentTime = new Date();

        // console.log(this.props.currentPlayerEndTime);
        // const diffTime = Math.ceil((theEndTime - currentTime.getTime()) / 1000);
        // console.log('time calc ', theEndTime, ' - ', currentTime.getTime());
        // console.log(diffTime, ' seconds given');

        // if (diffTime < 0) {
        //     return null;
        // }

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