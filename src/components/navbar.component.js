import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">Ward 2 Mutual Aid Requests!</Link>
        <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
          <Link to="/" className="nav-link">Request List</Link>
          </li>
          <li className="navbar-item">
          <Link to="/create" className="nav-link">Submit Request</Link>
          </li>
          <li className="navbar-item">
          <Link to="/map" className="nav-link">Request Map</Link>
          </li>
        </ul>
        </div>
      </nav>
    );
  }
}