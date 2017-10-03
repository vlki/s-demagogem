import React from 'react'
import ReactDOM from 'react-dom'

import 'bootstrap/dist/css/bootstrap.css'

import App from './App'

require('smoothscroll-polyfill').polyfill()

ReactDOM.render(<App />, document.getElementById('root'))
