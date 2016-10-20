import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class EventBodyQuoted extends Component {

  static displayName = "Event.Body.Quoted";

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
