import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class EventBody extends Component {

  static displayName = "Event.Body";

  static propTypes = {
    event: PropTypes.object,
  };

  renderEventAnnotation(event) {
    return (
        <div className={'event-tile ' + event.type}>
          <div className="event-data">
            {/* Event-data requires a classless empty div for vertical alignment */}
            <div>
              <i className="manicon manicon-person-word-bubble"></i>
              <div className="event-content">
                <p>
                  {event.content}
                </p>
              </div>
              <Link to="#" className="event-user">
                {event.user.displayName}
              </Link>
              {/* TODO: Include machine readable date-time */}
              <datetime className="event-date">
                {event.date}
              </datetime>
            </div>
          </div>
          <Link to="event.links.self" className="event-link">
            {'Keep reading'}<i className="manicon manicon-arrow-long-right"></i>
          </Link>
      </div>
    );
  }

  renderEventFile(event) {
    return (
        <div className={'event-tile ' + event.type}>
          <div className="event-data">
            {/* Event-data requires a classless empty div for vertical alignment */}
            <div>
              <i className="manicon manicon-cube-shine"></i>
              <h5 className="event-title">
                {event.title}
              </h5>
              <datetime className="event-date">
                {event.date}
              </datetime>
            </div>
          </div>
          <Link to="event.links.self" className="event-link">
            {'View More'}<i className="manicon manicon-arrow-long-right"></i>
          </Link>
        </div>
    );
  }

  renderEventInit(event) {
    return (
        <div className={'event-tile ' + event.type}>
          <div className="event-data">
            {/* Event-data requires a classless empty div for vertical alignment */}
            <div>
              <i className="manicon manicon-egg"></i>
              <h5 className="event-title">
                {'Project Kickoff'}
              </h5>
            <span className="event-subtitle">
              {event.content}
            </span>
              <datetime className="event-date">
                {event.date}
              </datetime>
            </div>
          </div>
          <div className="event-link"></div>
        </div>
    );
  }

  renderEventText(event) {
    return (
        <div className={'event-tile ' + event.type}>
          <div className="event-data">
            {/* Event-data requires a classless empty div for vertical alignment */}
            <div>
              <i className="manicon manicon-book-opening"></i>
              <h5 className="event-title">
                {event.title}
              </h5>
          <span className="event-subtitle">
            {event.content}
          </span>
              <datetime className="event-date">
                {'Text added ' + event.date}
              </datetime>
            </div>
          </div>
          <div className="event-link"></div>
        </div>
    );
  }

  renderEventTweet(event) {
    return (
        <div className={'event-tile ' + this.props.event.type}>
          <div className="event-data">
            {/* Event-data requires a classless empty div for vertical alignment */}
            <div>
              <i className="manicon manicon-twitter"></i>
              <Link to={event.relationships.author.links.self} target="_blank" className="event-user">
                {'@' + event.relationships.author.displayName}
              </Link>
              <div className="event-content">
                <p>
                  {event.content}
                </p>
              </div>
              <datetime className="event-date">
                {event.date}
              </datetime>
            </div>
          </div>
          <Link to="event.links.self" className="event-link">
            {'View More'}<i className="manicon manicon-arrow-long-right"></i>
          </Link>
        </div>
    );
  }


  renderEventByType(event) {
    switch (event.type) {
      case 'annotation':
        return this.renderEventAnnotation(event);
      case 'file':
        return this.renderEventFile(event);
      case 'init':
        return this.renderEventInit(event);
      case 'text':
        return this.renderEventText(event);
      case 'tweet':
        return this.renderEventTweet(event);
      default:
        return (
            ''
        );
    }
  }

  getPromptByType(type) {
    let output = '';

    switch(type) {
      case 'ANNOTATION_CREATED':
        output = 'Keep Reading';
        break;
      case 'TWEET':
        output = 'Visit Site';
        break;
      default:
        output = 'View More';
    }

    return output;
  }

  render() {
    return (
      <div className="event-body">
        {'Hello!'}
      </div>
    )
  }
}
