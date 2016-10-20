import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class EventBodyAttributable extends Component {

  static displayName = "Event.Body.Attributable";

  static propTypes = {
    event: PropTypes.object,
  };

  render() {
    return (
      <div className="event-body">
        {'Hello!'}
      </div>
    )
  }
}
