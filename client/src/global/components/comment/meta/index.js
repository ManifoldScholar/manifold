import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import classNames from "classnames";
import Authorize from "hoc/authorize";
import Avatar from "global/components/avatar/index";

export default class CommentMeta extends PureComponent {
  static propTypes = {
    creator: PropTypes.object.isRequired,
    comment: PropTypes.object.isRequired,
    parent: PropTypes.object
  };

  get avatarUrl() {
    if (this.props.creator.attributes.avatarStyles) {
      return this.props.creator.attributes.avatarStyles.smallSquare;
    } else return null;
  }

  get avatarClassNames() {
    return classNames({
      "annotation-meta__avatar": true,
      "annotation-meta__avatar--dull": !this.props.creator.attributes
        .isCurrentUser,
      "annotation-meta__avatar-placeholder-container": !this.avatarUrl,
      "annotation-meta__avatar-image-container": this.avatarUrl
    });
  }

  render() {
    const { comment, creator } = this.props;

    return (
      <section className="annotation-meta">
        <div>
          <div className={this.avatarClassNames}>
            <Avatar url={this.avatarUrl} />
          </div>
          <h4 className="annotation-meta__author-name">
            {creator.attributes.fullName}
          </h4>
          <span className="annotation-meta__datetime">
            <FormattedDate
              format="distanceInWords"
              date={comment.attributes.createdAt}
            />{" "}
            ago
          </span>
        </div>
        <div className="markers">
          {comment.attributes.authorCreated ? (
            <div className="marker tertiary">{"Author"}</div>
          ) : null}
          {comment.attributes.deleted ? (
            <div className="marker secondary">Deleted</div>
          ) : null}
          <Authorize kind="admin">
            {comment.attributes.flagsCount > 0 ? (
              <div className="marker secondary">
                {comment.attributes.flagsCount}
                {comment.attributes.flagsCount === 1 ? " flag" : " flags"}
              </div>
            ) : null}
          </Authorize>
        </div>
      </section>
    );
  }
}
