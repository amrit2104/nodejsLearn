import React from 'react';
import { NavLink } from 'react-router-dom';
// NavLink will render a normal anchor tag in the end but when we click on it, it will catch then click and prevent the default which would be that the browser sends, on click it will manually render the right page for you without reloading
// While, a href tag reloads the page

import './MainNavigation.css';

const mainNavigation = props => (
  <header className="main-navigation">
    <div className="main-navigation__logo">
      <h1>Eventify.com</h1>
    </div>
    <nav className="main-navigation__items">
      <ul>
        <li>
          <NavLink to="/auth">Authenticate</NavLink>
        </li>
        <li>
          <NavLink to="/events">Events</NavLink>
        </li>
        <li>
          <NavLink to="/bookings">Bookings</NavLink>
        </li>
      </ul>
    </nav>
  </header>
);

export default mainNavigation;