import React, { Component, PropTypes } from 'react';
import Body from './Body/';
import { Link } from 'react-router';

export default class Teaser extends Component {

  static displayName = "Event.Teaser";

  static propTypes = {
    event: PropTypes.object,
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

    const eventWrapperProps = {
      className: 'event-tile'
    };

    let eventPrompt = false;

    const eventLinked = attr.eventUrl ? true : false;
    if (eventLinked) {
      eventPrompt = (
        <span>
          <a target="_blank" href={this.props.event.attributes.eventUrl}>
            {this.getPromptByType(attr.eventType)}
            <i className="manicon manicon-arrow-long-right"></i>
          </a>
        </span>
      );
    }

    return (
      <div {...eventWrapperProps}>
        <EventBody event={this.props.event} icon={this.getEventIcon(attr.eventType)} />
        <div className="event-prompt">
          {eventPrompt}
        </div>
      </div>
    );
  }
}
