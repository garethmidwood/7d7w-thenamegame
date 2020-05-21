import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Tasks } from '../../../api/tasks.js';
import Task from '../../entities/Task.jsx';

import { GameConfigs } from '../../../api/gameconfig.js';

class Play extends Component {
  handlePass(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
 
    Meteor.call('tasks.insert', text);
  }

  handleNext(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
 
    Meteor.call('tasks.insert', text);
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
{/* 
          <form className="new-task" onSubmit={this.handleNewTaskSubmit.bind(this)} >
            <input
              type="text"
              ref="textInput"
              placeholder="Type to add a new person"
            />
          </form> */}
          
{/* 
          <ul>
            {this.renderNameList()}
          </ul>
 */}



          <p>done button?</p>
          <p>pass button?</p>
          <p>How to make a persons turn end?</p>

          <h1>
          { this.props.activePlayer.value.name == this.props.currentUser.username ?
            "It's your turn"
            : this.props.activePlayer.value.name + " is playing"
          }
          </h1>
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
    activePlayer: GameConfigs.findOne("activePlayer")
  };
})(Play);