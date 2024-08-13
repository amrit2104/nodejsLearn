// Still need to implement: responsive navigation bar.

import React, { Component } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';

import MainNavigation from './components/Navigation/MainNavigation';

import './App.css';

class App extends Component {
  render() {
    return (
      // React Fragment is basically an empty shell you could say. It doesnot render a real HTML element
      <BrowserRouter>
      <React.Fragment>
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
            <Route path="/" element={<Navigate to="/auth" />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
        </Routes>
      </main>
      </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;