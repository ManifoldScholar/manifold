import React, { Component } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class TextListListItemCounts extends Component {
  static displayName = "ContentBlock.Types.Texts.ListItem.Counts";

  static propTypes = {
    baseClass: PropTypes.string,
    text: PropTypes.object.isRequired
  };

  static defaultProps = {
    baseClass: "text-counts"
  };

  get annotationsCount() {
    return this.props.text.attributes.annotationsCount;
  }

  get highlightsCount() {
    return this.props.text.attributes.highlightsCount;
  }

  render() {
    return (
      <ul className={`${this.props.baseClass}__interaction-list`}>
        <li className={`${this.props.baseClass}__interaction`}>
          <Utility.IconComposer
            size={32}
            icon="interactAnnotate32"
            iconClass={`${this.props.baseClass}__interaction-icon`}
          />
          <span
            aria-hidden
            className={`${this.props.baseClass}__interaction-label`}
          >
            {this.annotationsCount}
          </span>
          <span className="screen-reader-text">
            This text has {this.annotationsCount} annotations
          </span>
        </li>
        <li className={`${this.props.baseClass}__interaction`}>
          <Utility.IconComposer
            size={32}
            icon="interactHighlight32"
            iconClass={`${this.props.baseClass}__interaction-icon`}
          />
          <span
            aria-hidden
            className={`${this.props.baseClass}__interaction-label`}
          >
            {this.highlightsCount}
          </span>
          <span className="screen-reader-text">
            This text has {this.highlightsCount} highlights
          </span>
        </li>
      </ul>
    );
  }
}
