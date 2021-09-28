import React, { Component } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import classNames from "classnames";
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
    return get(
      this.props,
      "annotation.attributes.creatorAvatarStyles.smallSquare"
    );
  }

  getIcon(format) {
    let icon = null;
    switch (format) {
      case "annotation":
        icon = "interactComment24";
        break;
      case "highlight":
        icon = "interactAnnotate24";
        break;
      case "bookmark":
        icon = "interactHighlight24";
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
          className={classNames({
            "notes-filtered-list__item-creator-avatar": true,
            "notes-filtered-list__item-creator-avatar--image": this.avatarUrl,
            "notes-filtered-list__item-creator-avatar--default": !this.avatarUrl
          })}
        />
        <span className="truncate-text-overflow">{creatorName}</span>
      </span>
    );
    const tagProps =
      commentsCount === 0
        ? { className: "annotation-tag--creator" }
        : {
            icon: "interactComment16",
            iconSize: 16,
            iconCount: commentsCount,
            className: "annotation-tag--creator"
          };

    return <Tag {...tagProps}>{creator}</Tag>;
  }

  renderReadingGroupTag() {
    const tagProps = !this.showLock
      ? { className: "annotation-tag--group" }
      : { icon: "lock16", iconSize: 14, className: "annotation-tag--group" };

    return (
      <span className="annotation-tag__left-align">
        <Tag {...tagProps}>{this.currentGroupName}</Tag>
      </span>
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
