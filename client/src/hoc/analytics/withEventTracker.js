import React from "react";
import hoistStatics from "hoist-non-react-statics";
import { ManifoldAnalyticsContext } from "helpers/contexts";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default function withEventTracker(WrappedComponent) {
  const displayName = `withEventTracker('${getDisplayName(WrappedComponent)})`;

  class WithEventTracker extends React.PureComponent {
    static WrappedComponent = WrappedComponent;

    static displayName = displayName;

    static contextType = ManifoldAnalyticsContext;

    trackEvent = (event, resourceType = null, resourceId = null) => {
      this.context.track({
        event,
        resourceType,
        resourceId
      });
    };

    render() {
      const props = {
        ...this.props,
        trackEvent: this.trackEvent
      };
      return React.createElement(WrappedComponent, props);
    }
  }

  return hoistStatics(WithEventTracker, WrappedComponent);
}
