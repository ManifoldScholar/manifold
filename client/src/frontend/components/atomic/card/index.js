import React from "react";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import Utility from "global/components/utility";
import PropTypes from "prop-types";
import classNames from "classnames";

const Card = ({
  header = false,
  title,
  link = [],
  linkStyle = { textDecoration: "none" },
  icon,
  iconSize = 24,
  blockClass = "frontend",
  children
}) => {
  const headerContent = () => {
    const linked = link.length > 0;
    const getClass = base => {
      return classNames({
        [base]: true,
        "is-linked": linked
      });
    };
    const content = (
      <div className={getClass("card__header")}>
        <div className="card__header-title">{title}</div>
        {icon && (
          <div className={getClass("card__header-icon")}>
            <Utility.IconComposer icon={icon} size={iconSize} />
          </div>
        )}
      </div>
    );
    return link.length > 0 ? (
      <Link style={linkStyle} to={lh.link(...link)}>
        {content}
      </Link>
    ) : (
      <div>{content}</div>
    );
  };
  return (
    <div className={blockClass}>
      <div className="card">
        {header && <div>{headerContent()}</div>}
        <div className="card__body">{children}</div>
      </div>
    </div>
  );
};

Card.propTypes = {
  header: PropTypes.bool,
  title: PropTypes.string,
  link: PropTypes.array,
  linkStyle: PropTypes.object,
  icon: PropTypes.string,
  blockClass: PropTypes.string
};

export default Card;
