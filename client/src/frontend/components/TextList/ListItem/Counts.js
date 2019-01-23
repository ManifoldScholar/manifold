import React, { Component } from "react";
import PropTypes from "prop-types";
import { Icon } from "global/components/svg";

export default class TextListListItemCounts extends Component {
  static displayName = "TextList.ListItem.Counts";

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
          <Icon.SpeechBubble
            size={32}
            iconClass={`${this.props.baseClass}__interaction-icon`}
          />
          {this.highlightsCount}
          <span className="screen-reader-text">
            This text has {this.highlightsCount} highlights
          </span>
        </li>
        <li className={`${this.props.baseClass}__interaction`}>
          <Icon.PencilSimple
            size={32}
            iconClass={`${this.props.baseClass}__interaction-icon`}
          />
          {this.annotationsCount}
          <span className="screen-reader-text">
            This text has {this.annotationsCount} annotations
          </span>
        </li>
      </ul>
    );
  }
}
