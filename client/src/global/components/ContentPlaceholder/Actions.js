import React from "react";
import PropTypes from "prop-types";
import Action, { actionProps } from "./Action";

const DOCS_URL = "https://manifoldapp.org/docs/";

const PlaceholderActions = ({ actions = [] }) => {
  const allActions = [
    ...actions,
    {
      title: "Visit our documentation",
      linkProps: {
        href: DOCS_URL,
        target: "_blank",
        rel: "noopener norefferer"
      }
    }
  ];

  return (
    <div className="content-placeholder__actions">
      {allActions.map((action, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Action key={index} {...action} />
      ))}
    </div>
  );
};

PlaceholderActions.displayName = "ContentPlaceholder.Actions";

PlaceholderActions.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape(actionProps))
};

export default PlaceholderActions;
