import React from "react";
import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';
import ChessBoard from "./ChessBoard/chessBoard";

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  /*
  return (
    <div class = "chess">
      <h1>Reecha's Chess Board</h1>
      <ChessBoard/>
    </div>
  );
  */
 return (
   <div>
     <h1>Hey There</h1>
     <h2> If you see me I work ! </h2>
   </div>
 );

}

export default App;