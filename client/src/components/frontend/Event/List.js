import React, { Component, PropTypes } from 'react';
import Teaser from './Teaser';
import classNames from 'classnames';

export default class EventList extends Component {

  static displayName = "Event.List";

  static propTypes = {
    events: PropTypes.array,
    columns: PropTypes.number,
    limit: PropTypes.number,
  };

  static defaultProps = {
    columns: 2,
    limit: 10
  };

  render() {
    const listClass = classNames({
      'event-list-primary': this.props.columns === 2,
      'event-list-secondary': this.props.columns === 3
    });

    return (
      <ul className={listClass} ref="eventList">
        {this.props.events.map((event, index) => {
          if (index < this.props.limit) {
            return (
              <li key={index}>
                <Teaser event={event} />
              </li>
            );
          }
        })}
      </ul>
    );
  }
}
