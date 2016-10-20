import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import Teaser from './Teaser';
import max from 'lodash/max';
import map from 'lodash/map';

export default class EventList extends Component {

  static displayName = "Event.List";

  static propTypes = {
    events: PropTypes.array
  };

  render() {
    return (
      <ul className="event-list-primary" ref="eventList">
        {this.props.events.map((event, index) => {
          return (
            <li key={index}>
              <Teaser event={event} />
            </li>
          );
        })}
      </ul>
    );
  }
}
