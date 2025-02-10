import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Icons from "global/components/icon";
import UniqueIcons from "global/components/icon/unique";
import endsWith from "lodash/endsWith";
import humps from "utils/humps";
import MissingIcon from "./MissingIcon";

IconComposer.propTypes = {
  icon: PropTypes.string.isRequired,
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fill: PropTypes.string,
  stroke: PropTypes.string,
  svgProps: PropTypes.object
};

export default function IconComposer({
  icon = MissingIcon,
  fill = "currentColor",
  svgProps = { "aria-hidden": true },
  className,
  size,
  stroke
}) {
  const key = humps.pascalize(icon);
  const source = endsWith(key, "Unique") ? UniqueIcons : Icons;
  const IconComponent = source[key];
  const adjustedclassName = classNames(className, `svg-icon--${icon}`);

  const props = {
    svgProps,
    className: adjustedclassName,
    size,
    fill,
    stroke
  };

  return React.createElement(IconComponent ?? MissingIcon, props);
}
