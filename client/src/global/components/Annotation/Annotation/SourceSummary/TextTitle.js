/* This component exists because the i18next Trans component adds a children prop to all components passed through it. This isn't compatible with an element that uses dangerouslySetInnerHTML, so we need a wrapper. --LD */
import { maybeHtml, maybeReactNode } from "helpers/maybeHtml";

import React from "react";
import PropTypes from "prop-types";

export default function TextTitle({ title }) {
  return <i {...maybeHtml(title)}>{maybeReactNode(title)}</i>;
}

TextTitle.propTypes = {
  title: PropTypes.string
};
