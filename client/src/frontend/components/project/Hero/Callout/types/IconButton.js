import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Helper from "global/components/helper";
import Utility from "global/components/utility";

const IconButton = ({ callout, blockClass }) => {
  const {
    title,
    url,
    button,
    icon = { svg: "arrowRight16" }
  } = callout.attributes;
  const typeClass = button ? "button" : "link";

  const iconSize = () => {
    if (icon.size) {
      return icon.size;
    }
    return button ? 46 : 17.333;
  };

  const calloutClass = () => {
    return classNames({
      [`${blockClass}__button ${blockClass}__button--secondary ${blockClass}__button--left`]: button,
      [`${blockClass}__link`]: !button
    });
  };

  if (!url) return null;
  console.log(iconSize());
  return (
    <Helper.UserLink url={url} className={calloutClass()}>
      <>
        {icon.svg && (
          <Utility.IconComposer
            icon={icon.svg}
            size={iconSize()}
            iconClass={`${blockClass}__${icon}-icon`}
          />
        )}
        <span className={`${blockClass}__${typeClass}-text`}>{title}</span>
      </>
    </Helper.UserLink>
  );
};

IconButton.displayName = "DetailPage.Callout.IconButton";

IconButton.propTypes = {
  icon: PropTypes.string,
  callout: PropTypes.object,
  blockClass: PropTypes.string
};

export default IconButton;
