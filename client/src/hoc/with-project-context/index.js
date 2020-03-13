import React from "react";
import hoistStatics from "hoist-non-react-statics";
import { FrontendModeContext } from "helpers/contexts";
import BackLink from "frontend/components/back-link";
import lh from "helpers/linkHandler";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default function withProjectContext(WrappedComponent) {
  const displayName = `withProjectContext('${getDisplayName(
    WrappedComponent
  )})`;

  class WithProjectContext extends React.PureComponent {
    static WrappedComponent = WrappedComponent;

    static contextType = FrontendModeContext;

    static displayName = displayName;

    render() {
      const projectContext = this.context.project;
      const projectBackLink = projectContext ? (
        <BackLink.Register
          link={lh.link("frontendProjectDetail", projectContext.slug)}
          title={projectContext.titleFormatted}
        />
      ) : null;

      const props = { ...this.props, projectContext, projectBackLink };

      return React.createElement(WrappedComponent, props);
    }
  }

  return hoistStatics(WithProjectContext, WrappedComponent);
}
