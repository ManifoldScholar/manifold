/* This component exists because the i18next Trans component adds a children prop to all components passed through it. This isn't compatible with an element that uses dangerouslySetInnerHTML, so we need a wrapper. --LD */

import React from "react";
import PropTypes from "prop-types";

export default function TextTitle({ title }) {
  const maybeHtml = item => {
    const isHtml = !!item.__html;
    const hasTags =
      typeof title === "string" && !!title.match(/(<([^>]+)|(&#)>)/gi)?.length;
    /* eslint-disable no-nested-ternary */
    return isHtml
      ? { dangerouslySetInnerHTML: { ...item } }
      : hasTags
      ? { dangerouslySetInnerHTML: { __html: title } }
      : {};
  };

  const maybeReactNode = item => {
    const isReactNode =
      React.isValidElement(item) ||
      (typeof item === "string" && !title.match(/(<([^>]+)|(&#)>)/gi)?.length);
    return isReactNode ? item : null;
  };

  return <i {...maybeHtml(title)}>{maybeReactNode(title)}</i>;
}

TextTitle.propTypes = {
  title: PropTypes.string
};
