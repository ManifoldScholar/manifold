import React from "react";
import hoistStatics from "../hoist-non-react-statics";
import { useFrontendModeContext } from "hooks";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import lh from "helpers/linkHandler";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default function withProjectContext(WrappedComponent) {
  const displayName = `withProjectContext('${getDisplayName(
    WrappedComponent
  )})`;

  function WithProjectContext(props) {
    const context = useFrontendModeContext();
    const projectContext = context?.project;

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

    return React.createElement(WrappedComponent, {
      ...props,
      projectContext,
      projectBackLink
    });
  }

  WithProjectContext.WrappedComponent = WrappedComponent;
  WithProjectContext.displayName = displayName;

  return hoistStatics(WithProjectContext, WrappedComponent);
}
