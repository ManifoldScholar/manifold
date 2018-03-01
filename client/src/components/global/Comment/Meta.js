import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import isObject from "lodash/isObject";
import { FormattedDate } from "components/global";
import HigherOrder from "containers/global/HigherOrder";
import classNames from "classnames";

export default class CommentMeta extends PureComponent {
  static propTypes = {
    creator: PropTypes.object.isRequired,
    comment: PropTypes.object.isRequired,
    parent: PropTypes.object
  };

  render() {
    const { comment, creator, parent } = this.props;
    const avatarClass = classNames({
      "author-avatar": true,
      dull: creator && !creator.attributes.isCurrentUser
    });

    return (
      <section className="annotation-meta">
        <div>
          <figure className={avatarClass}>
            {creator.attributes.avatarStyles.smallSquare ? (
              <div
                className="image"
                style={{
                  backgroundImage: `url(${
                    creator.attributes.avatarStyles.smallSquare
                  })`
                }}
              >
                <span className="screen-reader-text">
                  Profile image for {creator.attributes.fullName}
                </span>
              </div>
            ) : (
              <div className="no-image">
                <i className="manicon manicon-person" />
              </div>
            )}
          </figure>
          <h4 className="author-name">
            {creator.attributes.fullName}
            {isObject(parent) ? (
              <span className="reply-to">
                <i className="manicon manicon-arrow-curved-right" />
                Reply to {parent.relationships.creator.attributes.fullName}
              </span>
            ) : null}
          </h4>
          <span className="datetime">
            <FormattedDate
              format="distanceInWords"
              date={comment.attributes.createdAt}
            />{" "}
            ago
          </span>
        </div>
        <div className="markers">
          {comment.attributes.deleted ? (
            <div className="marker secondary">Deleted</div>
          ) : null}
          <HigherOrder.Authorize kind="admin">
            {comment.attributes.flagsCount > 0 ? (
              <div className="marker secondary">
                {comment.attributes.flagsCount}
                {comment.attributes.flagsCount === 1 ? " flag" : " flags"}
              </div>
            ) : null}
          </HigherOrder.Authorize>
        </div>
      </section>
    );
  }
}
