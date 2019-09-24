import React, { Component } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

import withReadingGroups from "hoc/with-reading-groups";

class GroupItem extends Component {
  static displayName = "Notes.Partial.GroupItem";

  static propTypes = {
    annotation: PropTypes.object,
    visitHandler: PropTypes.func
  };

  get currentGroupName() {
    const {
      readingGroupId,
      readingGroupName,
      private: isPrivate
    } = this.props.annotation.attributes;
    if (isPrivate) return this.privateLabel;
    if (!readingGroupId) return this.publicLabel;
    return readingGroupName;
  }

  get showLock() {
    const {
      readingGroupPrivacy,
      private: isPrivate
    } = this.props.annotation.attributes;
    return (
      readingGroupPrivacy === "private" ||
      readingGroupPrivacy === "anonymous" ||
      isPrivate
    );
  }

  get publicLabel() {
    return "My Public Annotations";
  }

  get privateLabel() {
    return "My Private Annotations";
  }

  getIcon(format) {
    let icon = null;
    switch (format) {
      case "annotation":
        icon = "comment24";
        break;
      case "highlight":
        icon = "annotate24";
        break;
      case "bookmark":
        icon = "bookmark24";
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

  renderReadingGroupTag() {
    return (
      <span className="notes-filtered-list__tag">
        <span className="notes-filtered-list__tag-text">
          {this.currentGroupName}
        </span>
        {this.showLock && (
          <IconComposer
            icon="lock16"
            size={14}
            iconClass="notes-filtered-list__tag-icon"
          />
        )}
      </span>
    );
  }

  render() {
    const { format, subject } = this.props.annotation.attributes;
    const icon = this.getIcon(format);
    return (
      <li className="notes-filtered-list__item">
        <button
          onClick={this.handleVisitAnnotation}
          className="notes-filtered-list__item-button"
        >
          <span className="screen-reader-text">{`${format}.`}</span>
          <div className="notes-filtered-list__item-button-inner">
            {icon && (
              <IconComposer
                icon={icon}
                size={24}
                iconClass="notes-filtered-list__item-icon"
              />
            )}
            <span className="notes-filtered-list__item-inner">
              <span className="notes-filtered-list__item-text">{subject}</span>
              {this.renderReadingGroupTag()}
            </span>
          </div>
        </button>
      </li>
    );
  }
}

export default withReadingGroups(GroupItem);
