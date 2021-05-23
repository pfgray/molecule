

import logo from './logo.svg';
import './App.css';
import React from 'react';
import { NotificationBell } from './NotificationBell';
import { NotificationList } from './NotificationList';
import { addExampleNotification } from './notifications';
import { NotificationHistory } from './NotificationHistory';


function App() {

  return (
    <div className="App">
      <header className="App-header">
        <NotificationHistory />
        <img src={logo} className="App-logo" alt="logo" />
        <NotificationBell />
        <NotificationList />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={addExampleNotification}>add notification</button>
      </header>
    </div>
  );
}

export default App;
