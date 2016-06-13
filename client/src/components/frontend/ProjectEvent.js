import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class ProjectEvent extends Component {

  static propTypes = {
    event: PropTypes.object,
  };

  state = {
    containerPadding: {
      paddingTop: '0px',
      paddingBottom: '0px'
    }
  };

  /* eslint-disable react/no-did-update-set-state */
  componentDidUpdate() {
    const el = this.refs.eventContainer;
    const centerPadding = (el.parentNode.offsetHeight - el.offsetHeight) / 2;
    if (centerPadding > 0) {
      this.setState({ containerPadding: {
        paddingTop: centerPadding + 'px',
        paddingBottom: centerPadding + 'px'
      } });
    }
  }
  /* eslint-enable react/no-did-update-set-state */

  renderEventComment = (event) => {
    return (
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
    );
  };

  renderEventFile = (event) => {
    return (
        <div>
          <i className="manicon manicon-cube-shine"></i>
          <h5 className="event-title">
            {event.title}
          </h5>
          <datetime className="event-date">
            {event.date}
          </datetime>
        </div>
    );
  };

  renderEventInit = (event) => {
    return (
        <div>
          <i className="manicon manicon-egg"></i>
          <h5 className="event-title">
            {'Project Kickoff'}
              <span className="subtitle">
                {'A new Manifold project is born.'}
              </span>
          </h5>
          <datetime className="event-date">
            {event.date}
          </datetime>
        </div>
    );
  };

  renderEventText = (event) => {
    return (
        <div>
          <i className="manicon manicon-book-opening"></i>
          <h5 className="event-title">
            {event.title}
              <span className="subtitle">
                {event.subtitle}
              </span>
          </h5>
          <datetime className="event-date">
            {'Text added ' + event.date}
          </datetime>
        </div>
    );
  };

  renderEventTwitter = (event) => {
    return (
        <div>
          <i className="manicon manicon-twitter"></i>
          <Link to={'http://www.twitter.com/' + event.user} target="_blank" className="event-user">
            {'@' + event.user}
          </Link>
          <div className="event-content">
            <p>
              {event.content}
            </p>
          </div>
          {/* TODO: Include machine readable date-time */}
          <datetime className="event-date">
            {event.date}
          </datetime>
        </div>
    );
  };


  renderEventByType = (event) => {
    switch (event.type) {
      case 'comment':
        return this.renderEventComment(event);
      case 'file':
        return this.renderEventFile(event);
      case 'init':
        return this.renderEventInit(event);
      case 'text':
        return this.renderEventText(event);
      case 'twitter':
        return this.renderEventTwitter(event);
      default:
        return (
          ''
        );
    }
  };

  render() {
    return (
        <div ref="eventContainer" style={this.state.containerPadding}>
          {this.renderEventByType(this.props.event)}
        </div>
    );
  }
}
