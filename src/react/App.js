import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import Home from'../components/Home';
import { channels } from '../shared/constants';
const { ipcRenderer } = window; 

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appName: '',
      appVersion: '',
    };
    ipcRenderer.send(channels.APP_INFO);
    ipcRenderer.on(channels.APP_INFO, (event, arg) => {
      ipcRenderer.removeAllListeners(channels.APP_INFO);
      const { appName, appVersion } = arg;
      this.setState({ appName, appVersion });
    });
  }

  render() {
    const { appName, appVersion } = this.state;
    return (
      <div className="App">
        <Home></Home>
       
      </div>
    );
  }
}



export default App;
