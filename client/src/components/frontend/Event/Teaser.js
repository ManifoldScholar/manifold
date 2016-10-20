import React, { Component, PropTypes } from 'react';
import BodyAttributable from './Body/Attributable';
import BodyModelCreation from './Body/ModelCreation';
import BodyQuoted from './Body/ModelCreation';
import { Link } from 'react-router';

export default class Teaser extends Component {

  static displayName = "Event.Teaser";

  static propTypes = {
    event: PropTypes.object,
  };

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
    // Map event types to Event Body types
    const EventBodyMap = {
      'ANNOTATION_CREATED': {
          component: BodyQuoted,
          icon: 'person-word-bubble'
      },
      'PROJECT_CREATED': {
        component: BodyModelCreation,
        icon: 'egg'
      },
      'RESOURCE_CREATED': {
        component: BodyModelCreation,
        icon: 'cube-shine'
      },
      'TEXT_CREATED': {
        component: BodyModelCreation,
        icon: 'book-opening'
      },
      'TWEET': {
        component: BodyAttributable,
        icon: 'twitter'
      }
    };

    const eventType = this.props.event.attributes.event_type;

    const EventBody = EventBodyMap[eventType].component;

    const eventLinked = this.props.event.attributes.event_url ? true : false;
    let eventWrapperProps = {
      className: 'event-tile'
    };
    let eventPrompt = false;
    const EventWrapper =  eventLinked ? 'a' : 'div';

    if (eventLinked) {
      eventWrapperProps.href = this.props.event.attributes.event_url;
      eventPrompt = (
        <span>
          {this.getPromptByType(eventType)}
          <i className="manicon manicon-arrow-long-right"></i>
        </span>
      );
    }

    return (
      <EventWrapper {...eventWrapperProps}>
        <EventBody
          icon={EventBodyMap[eventType].icon}
          event={this.props.event}
        />
        <div className="event-prompt">
          {eventPrompt}
        </div>
      </EventWrapper>
    )
  }
}
