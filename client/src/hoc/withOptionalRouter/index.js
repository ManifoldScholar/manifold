import { useContext } from "react";
import { __RouterContext as RouterContext } from "react-router";
import hoistStatics from "hoc/hoist-non-react-statics";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

// Like react-router's `withRouter`, but injects no router props (rather than
// throwing) when rendered outside a <Router>.
export default function withOptionalRouter(WrappedComponent) {
  const WithOptionalRouter = props => {
    const context = useContext(RouterContext);
    return <WrappedComponent {...props} {...context} />;
  };

  WithOptionalRouter.displayName = `withOptionalRouter(${getDisplayName(
    WrappedComponent
  )})`;
  WithOptionalRouter.WrappedComponent = WrappedComponent;

  return hoistStatics(WithOptionalRouter, WrappedComponent);
}
