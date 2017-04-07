import React, { Component, PropTypes } from 'react';
import Body from './Body/';
import classNames from 'classnames';
import { Link } from 'react-router';

export default class Teaser extends Component {

  static displayName = "Event.Teaser";

  static propTypes = {
    event: PropTypes.object,
    showLink: PropTypes.bool
  };

  static defaultProps = {
    showLink: true
  };

  getPromptByType(type) {
    let output = '';

    switch (type) {
      case 'ANNOTATION_CREATED':
        output = 'Keep Reading';
        break;
      case 'TWEET':
        output = 'View Tweet';
        break;
      case 'RESOURCE_ADDED':
        output = 'View Resource';
        break;
      case 'TEXT_ADDED':
        output = 'Start Reading';
        break;
      default:
        output = 'View More';
    }

    return output;
  }

  getEventIcon(type) {
    const eventIconMap = {
      ANNOTATION_ADDED: 'person-word-bubble',
      PROJECT_CREATED: 'egg',
      RESOURCE_ADDED: 'cube-shine',
      TEXT_ADDED: 'book-opening',
      TWEET: 'twitter'
    };

    return eventIconMap[type];
  }

  getEventBody(type) {
    let component = false;
    switch (type) {
      case 'ANNOTATION_CREATED':
        component = Body.Quoted;
        break;
      case 'TWEET':
        component = Body.Attributable;
        break;
      case 'RESOURCE_ADDED':
      case 'TEXT_ADDED':
        component = Body.Added;
        break;
      default:
        component = Body.Created;
    }

    return component;
  }

  render() {
    const attr = this.props.event.attributes;

    const EventBody = this.getEventBody(attr.eventType);

    const eventWrapperClass = classNames({
      'event-tile': true,
      tweet: attr.eventType === 'TWEET'
    });

    const eventWrapperProps = {
      className: eventWrapperClass
    };

    let eventPrompt = false;

    const eventLinked = attr.eventUrl ? true : false;
    if (eventLinked) {
      eventPrompt = (
        <a target="_blank" href={this.props.event.attributes.eventUrl}>
          {this.getPromptByType(attr.eventType)}
          <i className="manicon manicon-arrow-long-right"></i>
        </a>
      );
    }

    return (
      <div {...eventWrapperProps}>
        <EventBody event={this.props.event} icon={this.getEventIcon(attr.eventType)} />
        { this.props.showLink ?
          <div className="event-prompt">
            {eventPrompt}
          </div>
        : null }
      </div>
    );
  }
}
