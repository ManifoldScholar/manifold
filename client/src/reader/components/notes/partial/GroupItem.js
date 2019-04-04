import React, { Component } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

export default class GroupItem extends Component {
  static displayName = "Notes.Partial.GroupItem";

  static propTypes = {
    annotation: PropTypes.object,
    visitHandler: PropTypes.func
  };

  getIcon(format) {
    let icon = null;
    switch (format) {
      case "annotation":
        icon = "comment32";
        break;
      case "highlight":
        icon = "annotate32";
        break;
      case "bookmark":
        icon = "bookmark32";
        break;
      default:
        break;
    }
    return icon;
  }

  handleVisitAnnotation = event => {
    event.preventDefault();
    this.props.visitHandler(this.props.annotation);
  };

  maybeTruncateText(text) {
    return text.length > 58 ? text.slice(0, 58) + "..." : text;
  }

  render() {
    const icon = this.getIcon(this.props.annotation.attributes.format);
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
        {icon && <IconComposer icon={icon} size={32} iconClass="item__icon" />}
        <span>
          {this.maybeTruncateText(this.props.annotation.attributes.subject)}
        </span>
      </li>
      /* eslint-enable jsx-a11y/no-noninteractive-element-to-interactive-role */
    );
  }
}
