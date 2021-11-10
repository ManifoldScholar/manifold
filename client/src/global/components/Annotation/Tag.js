import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";

const Tag = ({ className, children, icon, iconSize, iconCount }) => (
  <span className={classNames(["annotation-tag", className])}>
    <span className="annotation-tag__inner">
      <span className="annotation-tag__text">{children}</span>
      {icon && !iconCount && (
        <IconComposer
          icon={icon}
          size={iconSize}
          className="annotation-tag__icon"
        />
      )}
    </span>
    {icon && iconCount > 0 && (
      <span className="annotation-tag__inner annotation-tag__inner--dark">
        <IconComposer
          icon={icon}
          size={iconSize}
          className="annotation-tag__icon"
        />
        <span className="annotation-tag__text annotation-tag__text--count">
          {iconCount}
        </span>
      </span>
    )}
  </span>
);

Tag.displayName = "Annotation.Tag";

Tag.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  icon: PropTypes.string,
  iconSize: PropTypes.number,
  iconCount: PropTypes.number
};

export default Tag;
