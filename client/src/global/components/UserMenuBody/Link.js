import React from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
import IconComposer from "global/components/utility/IconComposer";

function UserMenuBodyLink({ as = "a", to, title, icon, onClick }) {
  const Tag = as === "a" ? NavLink : "button";
  return (
    <li className="user-menu__item">
      <Tag to={to} className="user-menu__link" onClick={onClick}>
        <IconComposer icon={icon} size={32} className="user-menu__icon" />
        <span className="user-menu__link-text">{title}</span>
      </Tag>
    </li>
  );
}

UserMenuBodyLink.displayName = "UserMenuBody.Link";

UserMenuBodyLink.propTypes = {
  as: PropTypes.oneOf(["a", "button"]),
  to: PropTypes.string,
  title: PropTypes.string.isRequired,
  srTitle: PropTypes.string,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default withRouter(UserMenuBodyLink);
