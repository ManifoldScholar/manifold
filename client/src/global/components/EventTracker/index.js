import React from "react";
import { ManifoldAnalyticsContext } from "helpers/contexts";

export const EVENTS = {
  VIEW_RESOURCE: "view resource",
  VIEW_LIBRARY: "view library"
};

export default class EventTracker extends React.PureComponent {
  static contextType = ManifoldAnalyticsContext;

  get resourceType() {
    const { resource } = this.props;
    if (!resource) return null;
    return resource.type;
  }

  get resourceId() {
    const { resource } = this.props;
    if (!resource) return null;
    return resource.id;
  }

  get eventName() {
    const { event } = this.props;
    return event;
  }

  get event() {
    return {
      resourceType: this.resourceType,
      resourceId: this.resourceId,
      event: this.eventName
    };
  }

  componentDidMount() {
    this.context.track(this.event);
  }

  render() {
    return null;
  }
}
