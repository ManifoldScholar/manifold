import React from "react";

const helpLink = "https://manifoldapp.org/docs/";

const PlaceholderActions = ({ children }) => (
  <div className="content-placeholder__actions">
    {children}
    <div className="content-placeholder__ext-link-wrapper">
      <a
        href={helpLink}
        target="_blank"
        rel="noopener noreferrer"
        className="content-placeholder__ext-link"
      >
        Visit our documentation
      </a>
    </div>
  </div>
);

PlaceholderActions.displayName = "ContentPlaceholder.Actions";

export default PlaceholderActions;
