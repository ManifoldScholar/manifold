import React from "react";
import PropTypes from "prop-types";

function Action({ linkProps, buttonProps, title, children }) {
  if (children) return children;
  if (linkProps)
    return (
      <a className="button-tertiary" {...linkProps}>
        {title}
      </a>
    );
  if (buttonProps)
    return (
      <button className="button-tertiary" {...buttonProps}>
        {title}
      </button>
    );
  return null;
}

export const actionProps = {
  title: PropTypes.string,
  linkProps: PropTypes.object,
  buttonProps: PropTypes.object,
  children: PropTypes.node
};

Action.displayName = "Global.Entity.CollectionPlaceholder.Action";

Action.propTypes = actionProps;

export default Action;
