import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link } from "react-router-dom";

function MemberActionButtonish({ to, onClick, className, children }) {
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

MemberActionButtonish.displayName = "MembersTable.Member.ActionButtonish";

MemberActionButtonish.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  to: PropTypes.string,
  className: PropTypes.string
};

export default MemberActionButtonish;
