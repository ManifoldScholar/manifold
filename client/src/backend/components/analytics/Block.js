import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";

function Block({ icon, title, description, children, width }) {
  const blockClassName = classNames({
    "analytics-block": true,
    [`analytics-grid__item analytics-grid__item--${width}`]: !!width
  });
  const Description = ({ value }) => {
    if (!value) return null;
    if (typeof value === "string")
      return <p className="analytics-block__description">{value}</p>;
    return value;
  };
  return (
    <article aria-live="polite" aria-atomic className={blockClassName}>
      <header className="analytics-block__heading">
        <h3 className="analytics-block__title">
          <Utility.IconComposer
            icon={icon}
            size={32}
            className="analytics-block__icon"
          />
          <span className="analytics-block__title-text">{title}</span>
        </h3>
        <Description value={description} />
      </header>
      <div className="analytics-block__body">{children}</div>
    </article>
  );
}

Block.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  children: PropTypes.node.isRequired,
  width: PropTypes.oneOf([25, 50, 100])
};

Block.displayName = "Analytics.Block";

export default Block;
