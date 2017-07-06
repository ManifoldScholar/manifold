import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Event } from 'components/frontend';

export default class EventListItem extends PureComponent {

  static displayName = "Event.ListItem";

  static propTypes = {
    event: PropTypes.object,
    destroyHandler: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.triggerDestroy = this.triggerDestroy.bind(this);
  }

  triggerDestroy(event) {
    event.preventDefault();
    this.props.destroyHandler(this.props.entity);
  }

  render() {
    const event = this.props.entity;
    if (!event) return null;
    const attr = event.attributes;
    const content = attr.excerpt ? attr.excerpt : attr.subjectTitle;
    return (
      <li key={event.id} className="list-item">
        <Event.Teaser
          event={event}
          showLink={false}
        />
        <div className="utility" data-id={'destroy'} onClick={this.triggerDestroy}>
          <i className="manicon manicon-trashcan" />
        </div>
      </li>
    );

  }

}
