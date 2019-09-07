import React, { Component } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

import withReadingGroups from "hoc/with-reading-groups";

class GroupItem extends Component {
  static displayName = "Notes.Partial.GroupItem";

  static propTypes = {
    annotation: PropTypes.object,
    visitHandler: PropTypes.func,
    readingGroups: PropTypes.array
  };

  get currentGroup() {
    const { readingGroupId } = this.props.annotation.attributes;
    if (!this.props.readingGroups) return null;
    if (this.isPrivate) return "private";
    if (!readingGroupId) return "public";
    return this.props.readingGroups.find(group => group.id === readingGroupId);
  }

  get isPrivate() {
    return this.props.annotation.attributes.private;
  }

  get showLock() {
    if (this.currentGroup === "public") return false;
    return this.isPrivate || this.currentGroup.attributes.privacy === "private";
  }

  get publicLabel() {
    return "My Public Annotations";
  }

  get privateLabel() {
    return "My Private Annotations";
  }

  get currentGroupName() {
    if (this.isPrivate) return this.privateLabel;
    if (this.currentGroup === "public") return this.publicLabel;
    return this.currentGroup.attributes.name;
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
    if (!this.currentGroup) return null;
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
