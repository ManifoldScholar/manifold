import React from "react";
import { useDeprecatedFetchData } from "hooks";
import { isFunction } from "lodash";

export default function fetchData(Component) {
  if (!isFunction(Component.fetchData))
    return props => <Component {...props} />;

  return props => {
    const triggerFetchData = useDeprecatedFetchData(
      Component.fetchData,
      props.location,
      props.match
    );
    return <Component {...props} fetchData={triggerFetchData} />;
  };
}
