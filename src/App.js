import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './Home'
import Theater from './Theater'

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/volby-2017-lidr-piratu-v-cro" component={Theater} />
          <Route path="/volby-2017-lidr-svobodnych-v-cro" component={Theater} />
        </div>
      </Router>
    )
  }
}

export default App
