import React from 'react';
import axios from 'axios';

import './app.css';
import ReactImage from './react.png';

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      dataSubmissions: undefined,
      dataUsers: undefined,
      dataComments: undefined
    };

    this.timeframes = {
      january: {
        start: '2019-01-01 00:00:00'.replace(' ', '%20'),
        end: '2019-02-01 00:00:00'.replace(' ', '%20')
      }
    };

    this.monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
  }

  componentDidMount() {
    axios
      .get(`/api/submissions?start=${this.timeframes.january.start}&end=${this.timeframes.january.end}`)
      .then(res => {
        this.setState({ dataSubmissions: JSON.stringify(res.data) });
        console.log(res.data);
      });

    axios
      .get(`/api/users?start=${this.timeframes.january.start}&end=${this.timeframes.january.end}`)
      .then(res => {
        this.setState({ dataUsers: JSON.stringify(res.data) });
        console.log(res.data);
      });

    axios
      .get(`/api/comments?start=${this.timeframes.january.start}&end=${this.timeframes.january.end}`)
      .then(res => {
        this.setState({ dataComments: JSON.stringify(res.data) });
        console.log(res.data);
      });
  }

  render() {
    const wordBreak = { wordBreak: 'break-all' };
    return (
      <div>
        <h1>
          Data for {this.monthNames[new Date(this.timeframes.january.start.replace('%20', ' ')).getMonth()]}
        </h1>
        <h3>Submissions</h3>
        <p style={wordBreak}>{this.state.dataSubmissions}</p>
        <h3>Users</h3>
        <p style={wordBreak}>{this.state.dataUsers}</p>
        <h3>Comments</h3>
        <p style={wordBreak}>{this.state.dataComments}</p>
      </div>
    );
  }
}
