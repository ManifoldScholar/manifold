/* This component exists because the i18next Trans component adds a children prop to all components passed through it. This isn't compatible with an element that uses dangerouslySetInnerHTML, so we need a wrapper. --LD */

import React from "react";
import PropTypes from "prop-types";

export default function TextTitle({ title }) {
  const maybeHtml = item => {
    const isHtml = !!item.__html;
    return isHtml ? { dangerouslySetInnerHTML: { ...item } } : {};
  };

  const maybeReactNode = item => {
    const isReactNode = React.isValidElement(item) || typeof item === "string";
    return isReactNode ? item : null;
  };

  return <i {...maybeHtml(title)}>{maybeReactNode(title)}</i>;
}

TextTitle.propTypes = {
  title: PropTypes.string
};
