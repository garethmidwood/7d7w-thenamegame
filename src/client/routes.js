import React from 'react'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { mount } from 'react-mounter'

import App from '../imports/ui/App.jsx'
import HomePage from '../imports/ui/pages/HomePage.jsx'
import GamePage from '../imports/ui/pages/GamePage.jsx'




FlowRouter.route('/', {
  name: 'Home',
  triggersEnter: [() => {
    if (Meteor.userId()) {
      FlowRouter.go('/game/play')
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
gameRoutes.route('/play', {
  name: 'Play',
  action(){
    mount(App, { content: <GamePage /> })
  }
})