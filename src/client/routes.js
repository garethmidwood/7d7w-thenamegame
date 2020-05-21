import React from 'react'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { mount } from 'react-mounter'

import App from '../imports/ui/App.jsx'
import HomePage from '../imports/ui/pages/HomePage.jsx'
import AddNamesPage from '../imports/ui/pages/AddNamesPage.jsx'




FlowRouter.route('/', {
  name: 'Home',
  triggersEnter: [() => {
    if (Meteor.userId()) {
      FlowRouter.go('/game/add-names')
    }
  }],
  action(){
    mount(App, { content: <HomePage /> })
  }
})



// Must be logged in to access any game routes
// if not then redirect to homepage to login
const gameRoutes = FlowRouter.group({
    prefix: '/game',
    triggersEnter: [
        (context, redirect) => {
            if (!Meteor.userId()) {
                redirect("/");
            }
        }
    ]
});

// pre-game, add some names to the list
gameRoutes.route('/add-names', {
  name: 'Add names',
  triggersEnter: [() => {
    if (!Meteor.userId()) {
      FlowRouter.go("/");
    }
  }],
  action(){
    mount(App, { content: <AddNamesPage /> })
  }
})