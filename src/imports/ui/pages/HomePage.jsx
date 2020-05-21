import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { userstatus } from '../../api/users.js';
import UserStatus from '../entities/Userstatus.jsx';

import AccountsUIWrapper from '../components/AccountsUIWrapper.jsx';



class HomePage extends Component {

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
      <div className="container">
        <header>
          <h1>The name game!</h1>
          <p>Sign in or create an account</p>

          <AccountsUIWrapper />

          {/* 
            TODO: This should automatically redirect you
            to the 'add names' page once you login.
            It probably doesn't need to be done *here* but
            this will need removing when it works properly
          */}
          { this.props.currentUser ?
            <div>
              Click here to join the game and <a href="/game/play">add some names</a>
            </div>
            : ''
          }

 
        </header>
 
        <h2>Who's online?</h2>
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
})(HomePage);