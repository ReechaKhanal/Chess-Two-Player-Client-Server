// import React from "react";
import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';
import ChessBoard from "./ChessBoard/chessBoard";

import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://127.0.0.1:8000');

class App extends Component {
  componentWillMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      console.log(message);
    };
  }
  
  render() {
    return (
      <div>
        Practical Intro To WebSockets.
      </div>
    );
  }
}

/*
function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

 return (
   <div>
     <h1>Hey There</h1>
     <h2> If you see me I work ! </h2>
   </div>
 );

}
*/
export default App;