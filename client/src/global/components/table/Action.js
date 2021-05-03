import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link } from "react-router-dom";

function Action({ to, onClick, className, children }) {
  if (to)
    return (
      <Link
        to={to}
        className={classNames({
          "button-lozenge-primary": true,
          [`${className}`]: !!className
        })}
        onClick={onClick}
      >
        {children}
      </Link>
    );

  return (
    <button
      className={classNames({
        "button-lozenge-primary": true,
        [`${className}`]: !!className
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

Action.displayName = "GenericTable.Action";

Action.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  to: PropTypes.string,
  className: PropTypes.string
};

export default Action;
