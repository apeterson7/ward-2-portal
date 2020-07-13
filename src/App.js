import React, { Component } from 'react';
import {Router, Route} from "react-router-dom";
import history from "./history";

import './App.css';

import RequestList from "./components/request-list.component";
import Navbar from "./components/navbar.component"
import RequestEntry from "./components/request-entry.component";
import ReceiptConfirmation from "./components/confirmation-receipt.component";
import RequestMap from "./components/request-map.component";


class App extends Component { 

  render(){
    return (
      <Router history={history}>
        <div className="Container">
          <Navbar />
          <br/>
          <div className="row">
            <div className="col-2"></div>
            <div className="col-8">
              <Route path="/" exact component={RequestList} />
              <Route path="/create" component={RequestEntry} />
              <Route path="/receipt" component={ReceiptConfirmation} />
              <Route path="/map" component={RequestMap} />
            </div>
            <div className="col-2"></div>
          </div>
        </div>
      </Router>
    );
  }
}
  
export default App;



