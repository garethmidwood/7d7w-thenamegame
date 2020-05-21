import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
 
import { Tasks } from '../../api/tasks.js';
import Task from '../entities/Task.jsx';

import { userstatus } from '../../api/users.js';
import UserStatus from '../entities/Userstatus.jsx';

import AccountsUIWrapper from '../components/AccountsUIWrapper.jsx';


class AddNames extends Component {
  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
 
    Meteor.call('tasks.insert', text);
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;

    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;
 
      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }

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
        <h1>The Name Game</h1>

          <AccountsUIWrapper />
 
          <h3>Who's online?</h3>
          <ul>
            {this.renderOnlineUsers()}
          </ul>

          { this.props.currentUser ?
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add a new person"
              />
            </form> : ''
          }
        </header>
 
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('tasks');
  Meteor.subscribe('userstatus');

  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    onlineUsers: Meteor.users.find({ "status.online": true }).fetch(),
    currentUser: Meteor.user(),
  };
})(AddNames);