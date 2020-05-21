import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Tasks } from '../../../api/tasks.js';
import Task from '../../entities/Task.jsx';

class AddNames extends Component {
  handleNewTaskSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
 
    Meteor.call('tasks.insert', text);
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  renderNameList() {
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
        <div>

          <form className="new-task" onSubmit={this.handleNewTaskSubmit.bind(this)} >
            <input
              type="text"
              ref="textInput"
              placeholder="Type to add a new person"
            />
          </form>

          <h2>The names you added: </h2>
          <ul>
            {this.renderNameList()}
          </ul>
        </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('tasks');

  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user(),
  };
})(AddNames);