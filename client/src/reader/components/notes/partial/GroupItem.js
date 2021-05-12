import React, { Component } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import IconComposer from "global/components/utility/IconComposer";
import Tag from "global/components/Annotation/Tag";
import Avatar from "global/components/avatar";

import withReadingGroups from "hoc/with-reading-groups";

class GroupItem extends Component {
  static displayName = "Notes.Partial.GroupItem";

  static propTypes = {
    annotation: PropTypes.object,
    visitHandler: PropTypes.func,
    showAnnotationCreator: PropTypes.bool
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

  get annotationAttributes() {
    return get(this.props, "annotation.attributes");
  }

  get avatarUrl() {
    // TODO: Point to the right URL
    return get(this.props, "annotation.attributes.creatorAvatarStyles.small");
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

  renderCreatorTag() {
    const { creatorName, commentsCount } = this.annotationAttributes;
    const creator = (
      <span className="notes-filtered-list__item-creator">
        <Avatar
          iconSize={16}
          url={this.avatarUrl}
          className={"notes-filtered-list__item-creator-avatar"}
        />
        {creatorName}
      </span>
    );

    return commentsCount > 0 ? (
      <Tag icon="interactComment16" iconSize={16} iconCount={commentsCount}>
        {creator}
      </Tag>
    ) : (
      <Tag>{creator}</Tag>
    );
  }

  renderReadingGroupTag() {
    return this.showLock ? (
      <Tag icon="lock16" iconSize={14}>
        {this.currentGroupName}
      </Tag>
    ) : (
      <Tag>{this.currentGroupName}</Tag>
    );
  }

  render() {
    const { format, subject } = this.annotationAttributes;
    const { showAnnotationCreator } = this.props;

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
              <span className="notes-filtered-list__item-tag">
                {showAnnotationCreator
                  ? this.renderCreatorTag()
                  : this.renderReadingGroupTag()}
              </span>
            </span>
          </div>
        </button>
      </li>
    );
  }
}

export default withReadingGroups(GroupItem);
