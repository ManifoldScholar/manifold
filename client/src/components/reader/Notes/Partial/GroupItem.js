import React, { Component } from "react";
import PropTypes from "prop-types";

export default class GroupItem extends Component {
  static displayName = "Notes.List.GroupItem";

  static propTypes = {
    annotation: PropTypes.object,
    visitHandler: PropTypes.func
  };

  getIconClasses(format) {
    let icon = null;
    switch (format) {
      case "annotation":
        icon = "word-bubble";
        break;
      case "highlight":
        icon = "pencil-simple";
        break;
      case "bookmark":
        icon = "bookmark-outline";
        break;
      default:
        break;
    }
    return `manicon manicon-${icon}`;
  }

  handleVisitAnnotation = event => {
    event.preventDefault();
    this.props.visitHandler(this.props.annotation);
  };

  maybeTruncateText(text) {
    return text.length > 58 ? text.slice(0, 58) + "..." : text;
  }

  render() {
    const iconClasses = this.getIconClasses(
      this.props.annotation.attributes.format
    );
    return (
      /* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
      <li
        className="item"
        role="button"
        tabIndex="0"
        onClick={this.handleVisitAnnotation}
      >
        <span className="screen-reader-text">
          {this.props.annotation.attributes.format}
        </span>
        <i className={iconClasses} aria-hidden="true" />
        <span>
          {this.maybeTruncateText(this.props.annotation.attributes.subject)}
        </span>
      </li>
      /* eslint-enable jsx-a11y/no-noninteractive-element-to-interactive-role */
    );
  }
}
