import React from "react";
import { EventAnalyticsContext } from "helpers/contexts";

export const EVENTS = {
  VIEW: "view",
  SEARCH_RESULT: "search_result"
};

export default class EventTracker extends React.PureComponent {
  static contextType = EventAnalyticsContext;

  get properties() {
    const { resource, subject } = this.props;
    if (subject) return { subject };
    return {
      resource_id: resource.id,
      resource_type: resource.type
    };
  }

  get event() {
    const { event } = this.props;
    return event;
  }

  componentDidMount() {
    this.context.track(this.event, this.properties);
  }

  render() {
    return null;
  }
}
