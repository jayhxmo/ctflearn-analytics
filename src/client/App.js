import React from 'react';
import axios from 'axios';

import './app.css';
import ReactImage from './react.png';

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {};
    this.timeframes = {
      january: {
        start: '2019-01-01 00:00:00'.replace(' ', '%20'),
        end: '2019-02-01 00:00:00'.replace(' ', '%20')
      }
    };
  }

  componentDidMount() {
    // fetch('/api/getUsername')
    //   .then(res => res.json())
    //   .then(user => this.setState({ username: user.username }));

    axios
      .get(`/api/submissions?start=${this.timeframes.january.start}&end=${this.timeframes.january.end}`)
      .then(res => {
        console.log(res.data);
      });
    // .then(res => console.log(res.json()));
  }

  render() {
    return (
      <div>
        <img src={ReactImage} alt="react" />
      </div>
    );
  }
}
