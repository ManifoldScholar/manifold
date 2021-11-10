import React from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
import { useUID } from "react-uid";
import IconComposer from "global/components/utility/IconComposer";

function UserLink({ as = "a", to, title, srTitle, icon, onClick }) {
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
          <IconComposer
            icon={icon}
            size={32}
            className="nested-nav__button-icon"
          />
          <span className="nested-nav__button-text">{title}</span>
        </div>
      </Tag>
      {srTitle && (
        <span id={uid} className="screen-reader-text">
          {srTitle}
        </span>
      )}
    </li>
  );
}

UserLink.displayName = "Navigation.Mobile.Link";

UserLink.propTypes = {
  as: PropTypes.oneOf(["a", "button"]),
  to: PropTypes.string,
  title: PropTypes.string.isRequired,
  srTitle: PropTypes.string,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default withRouter(UserLink);
