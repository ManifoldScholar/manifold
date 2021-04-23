import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

function MemberActionButton({ onClick, className, children }) {
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

MemberActionButton.displayName = "MembersTable.Member.ActionButton";

MemberActionButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default MemberActionButton;
