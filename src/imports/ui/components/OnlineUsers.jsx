import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { userstatus } from '../../api/users.js';
import UserStatus from '../entities/Userstatus.jsx';

class OnlineUsers extends Component {
    renderOnlineUsers() {
        let onlineUsers = this.props.onlineUsers;

        return onlineUsers.map((onlineUser) => {
            const currentUserId = this.props.currentUser && this.props.currentUser._id;
            const isYou = onlineUser._id === currentUserId;

            return (
                <UserStatus
                key={onlineUser._id}
                onlineUser={onlineUser}
                isYou={isYou}
                />
            );
        });    
    }

  render() { 
    return (
        <div>
            <h3>Who's online?</h3>
            <ul>
                {this.renderOnlineUsers()}
            </ul>
        </div>
    );
  }
}

export default withTracker(() => {
    Meteor.subscribe('userstatus');

    return {
        onlineUsers: Meteor.users.find({ "status.online": true }).fetch(),
        currentUser: Meteor.user(),
    };
})(OnlineUsers);