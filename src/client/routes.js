import React from 'react'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { mount } from 'react-mounter'

import App from '../imports/ui/App'
import HomePage from '../imports/ui/pages/HomePage'
import AboutPage from '../imports/ui/pages/AboutPage'

FlowRouter.route('/', {
  name: 'Home',
  action(){
    mount( App, {
      content: <HomePage />
    })
  }
})

FlowRouter.route('/about', {
  name: 'About',
  action(){
    mount( App, {
      content: <AboutPage />
    })
  }
})