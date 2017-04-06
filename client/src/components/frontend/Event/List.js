import React, { Component, PropTypes } from 'react';
import Teaser from './Teaser';
import classNames from 'classnames';
import { Utility } from 'components/global';
import { linkHelpers as lh } from 'routes';

export default class EventList extends Component {

  static displayName = "Event.List";

  static propTypes = {
    events: PropTypes.array,
    project: PropTypes.object,
    columns: PropTypes.number,
    pagination: PropTypes.object
  };

  static defaultProps = {
    columns: 2,
    limit: 10
  };

  constructor(props) {
    super(props);
    this.paginationClickHandler = this.paginationClickHandler.bind(this);
  }

  paginationClickHandler(page) {
    return lh.frontendProjectEventsPage(this.props.project.id, page);
  }

  render() {
    if (!this.props.events) return null;

    const listClass = classNames({
      'event-list-primary': this.props.columns === 2,
      'event-list-secondary': this.props.columns === 3
    });

    return (
      <div>
        <ul className={listClass} ref="eventList">
          {this.props.events.map((event, index) => {
            return (
              <li key={index}>
                <Teaser event={event} />
              </li>
            );
          })}
        </ul>
        {
          this.props.pagination ?
            <Utility.Pagination
              paginationClickHandler={this.paginationClickHandler}
              pagination={this.props.pagination}
            />
          : null
        }
      </div>
    );
  }
}
