import React from 'react';
import ReactDom from 'react-dom'

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"

import './index.css';
import Chat from './Chat'

const App = () => <Chat />

ReactDom.render(<App />, document.getElementById('app'))
