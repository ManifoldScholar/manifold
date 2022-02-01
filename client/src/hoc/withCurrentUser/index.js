import React from "react";
import hoistStatics from "hoist-non-react-statics";
import { useCurrentUser } from "hooks";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default function withCurrentUser(WrappedComponent) {
  const displayName = `HigherOrder.WithCurrentUser('${getDisplayName(
    WrappedComponent
  )})`;

  function WithCurrentUser(props) {
    const currentUser = useCurrentUser();

    return <WrappedComponent {...props} currentUser={currentUser} />;
  }

  WithCurrentUser.displayName = displayName;

  return hoistStatics(WithCurrentUser, WrappedComponent);
}
