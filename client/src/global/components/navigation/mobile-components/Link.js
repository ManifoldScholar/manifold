import React from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
import { useUID } from "react-uid";

function UserLink({ as = "a", to, title, srTitle, iconComponent, onClick }) {
  const Tag = as === "a" ? NavLink : "button";
  const uid = useUID();
  return (
    <li className="nested-nav__item">
      <Tag
        to={to}
        className="nested-nav__button"
        onClick={onClick}
        aria-describedby={srTitle ? uid : null}
      >
        <div className="nested-nav__grid-item">
          {iconComponent}
          <span className="nested-nav__button-text">{title}</span>
        </div>
      </Tag>
      <span id={uid} className="aria-describedby">
        {srTitle}
      </span>
    </li>
  );
}

UserLink.displayName = "UserMenuBody.Link";

UserLink.propTypes = {
  as: PropTypes.oneOf(["a", "button"]),
  to: PropTypes.string,
  title: PropTypes.string.isRequired,
  srTitle: PropTypes.string,
  iconComponent: PropTypes.element.isRequired,
  onClick: PropTypes.func.isRequired
};

export default withRouter(UserLink);
