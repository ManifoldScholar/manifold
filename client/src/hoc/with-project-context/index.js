import React from "react";
import hoistStatics from "hoist-non-react-statics";
import { FrontendModeContext } from "helpers/contexts";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
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
        <RegisterBreadcrumbs
          breadcrumbs={[
            {
              to: lh.link("frontendProjectDetail", projectContext.slug),
              label: projectContext.titleFormatted
            }
          ]}
        />
      ) : null;

      const props = { ...this.props, projectContext, projectBackLink };

      return React.createElement(WrappedComponent, props);
    }
  }

  return hoistStatics(WithProjectContext, WrappedComponent);
}
