// Still need to implement: responsive navigation bar.

import React, { Component } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';

import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

import './App.css';

class App extends Component {
  state = {
    token: null,
    userId: null
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  }

  logout = () => {
    this.setState({ token:null, userId:null });
  }

  render() {
    return (
      // React Fragment is basically an empty shell you could say. It doesnot render a real HTML element
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}
          >
            <MainNavigation />
              <main className="main-content">
                <Routes>
                    {/* redirect component redirects the path from / to /auth while keyword "exact" points to auth only and prevents infinite redirects*/}
                    {/* Switch means only one out of all the alternatives will be used */}
                    {/* Navigate component redirects the path from / to /auth */}
                    
                    {/* Import Changes:

                    1. Removed Switch and Redirect imports.
                    2. Added Routes and Navigate imports from react-router-dom.

                    Route Configuration Changes:

                    1. Replaced <Switch> with <Routes>.
                    2. Replaced <Redirect> with <Route path="/" element={<Navigate to="/auth" />} />.
                    Used element prop instead of component for routes. */}
                    {!this.state.token && <Route path="/" element={<Navigate to="/auth" exact />} />}
                    {this.state.token && <Route path="/" element={<Navigate to="/events" exact />} />}
                    {this.state.token && <Route path="/auth" element={<Navigate to="/events" exact />} />}
                    {!this.state.token && <Route path="/auth" element={<AuthPage />} />}
                    <Route path="/events" element={<EventsPage />} />
                    {this.state.token && <Route path="/bookings" element={<BookingsPage />} />}
                </Routes>
              </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;