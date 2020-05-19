import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

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
