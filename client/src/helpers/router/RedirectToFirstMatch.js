import React from "react";
import { useRedirectToFirstMatch } from "hooks";

// Let's get rid of this component if/when we eventually refactor the backend containers.

export default function RedirectToFirstMatch(props) {
  useRedirectToFirstMatch(props);

  return null;
}
