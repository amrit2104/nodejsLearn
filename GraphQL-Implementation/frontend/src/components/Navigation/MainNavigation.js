import React from 'react';
import { NavLink } from 'react-router-dom';
// NavLink will render a normal anchor tag in the end but when we click on it, it will catch then click and prevent the default which would be that the browser sends, on click it will manually render the right page for you without reloading
// While, a href tag reloads the page

import AuthContext from '../../context/auth-context';
import './MainNavigation.css';

// !context.token if there is no token then it will redirect to authenticate, if authenticated then only you can go to bookings

const mainNavigation = props => (
  <AuthContext.Consumer>
    {context => {
        return (
          <header className="main-navigation">
            <div className="main-navigation__logo">
              <h1>EasyEvent</h1>
            </div>
            <nav className="main-navigation__items">
              <ul>
                {!context.token && (
                  <li>
                    <NavLink to="/auth">Authenticate</NavLink>
                  </li>
                )}
                <li>
                  <NavLink to="/events">Events</NavLink>
                </li>
                {context.token && (
                  <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                )}
              </ul>
            </nav>
          </header>
        );
      }
    }
  </AuthContext.Consumer>
);

export default mainNavigation;