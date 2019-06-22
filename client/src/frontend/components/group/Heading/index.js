import React, { Component } from "react";
import Utility from "global/components/utility";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class Heading extends Component {

  get pageTitle() {
    return "Manage Annotation Groups";
  }

  get groupHeadingClassNames() {
    return "group-page-heading";
  }

  get headingTextClassNames() {
    return classNames({
      "heading-primary": true,
      "group-page-heading__text": true
    })
  }

  render() {
    return (
      <div className={this.groupHeadingClassNames}>
        <Utility.IconComposer
          icon="annotationGroup24"
          size={32}
        />
        <h2 className={this.headingTextClassNames}>{this.pageTitle}</h2>
      </div>
    );
  }
}
