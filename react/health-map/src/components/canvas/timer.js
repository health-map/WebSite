/**
 * @file timer.js
 * @description Timer component
 *
 */

import React from 'react';
import moment from 'moment';

import './timer.css';


/**
 *
 */
export default class Timer extends React.Component {
  state = {
    currentTime: moment()
  }
  tick() {
    this.setState(() => ({
      currentTime: moment()
    }));
  }
  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    const timeText = this.state.currentTime.format('HH:mm');
    return (
      <span className="shy-timer">
        { timeText }
      </span>
    );
  }
}
