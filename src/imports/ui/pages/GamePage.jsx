import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
 
import { Tasks } from '../../api/tasks.js';
import Task from '../entities/Task.jsx';

import AccountsUIWrapper from '../components/AccountsUIWrapper.jsx';
import OnlineUsers from '../components/OnlineUsers.jsx';

class GamePage extends Component {
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
 
  render() {
    return (
      <div className="container">
        <header>
        <h1>The Name Game</h1>

          <AccountsUIWrapper />
 
          <OnlineUsers />

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
        <hr/>
 
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('tasks');

  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user()
  };
})(GamePage);