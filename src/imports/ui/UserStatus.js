import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import { userStatus } from '../api/userstatus.js';

// Task component - represents a single todo item
export default class UserStatus extends Component {
  render() { 
    return (
      <li>
        <span className="text">
          <strong>{this.props.onlineUser.username}</strong>

          { this.props.isYou ? (
            <span> this is you!</span>
          ) : ''}
        </span>
      </li>
    );
  }
}
// key={onlineUser._id}
// onlineUser={onlineUser}
// isYou={isYou}