import React from "react";
import PropTypes from "prop-types";
import Action, { actionProps } from "./Action";
import { Translation } from "react-i18next";

const DOCS_URL = "https://manifoldscholar.github.io/manifold-docusaurus/docs";

const PlaceholderActions = ({ actions = [] }) => {
  const allActions = t => {
    return [
      ...actions,
      {
        title: t(`visit-our-documentation`),
        linkProps: {
          href: DOCS_URL,
          target: "_blank",
          rel: "noopener norefferer"
        }
      }
    ];
  };

  return (
    <Translation>
      {t => (
        <div className="content-placeholder__actions">
          {allActions(t).map((action, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Action key={index} {...action} />
          ))}
        </div>
      )}
    </Translation>
  );
};

PlaceholderActions.displayName = "ContentPlaceholder.Actions";

PlaceholderActions.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape(actionProps))
};

export default PlaceholderActions;
