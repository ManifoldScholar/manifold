import React, { PureComponent } from "react";
import CommentContainer from "global/containers/comment";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

export default class CommentDeleted extends PureComponent {
  static propTypes = {
    comment: PropTypes.object.isRequired,
    subject: PropTypes.object.isRequired
  };

  render() {
    const { comment } = this.props;
    return (
      <li className="annotation-comment">
        <section className="annotation-meta">
          <figure className="author-avatar author-avatar--dull">
            <span className="screen-reader-text">Author Avatar</span>
            <div className="author-avatar__no-image" aria-hidden="true">
              <IconComposer
                icon="avatar64"
                size={39.385}
                iconClass="author-avatar__icon"
              />
            </div>
          </figure>
          <h4 className="deleted-notification">This comment was deleted.</h4>
        </section>
        <CommentContainer.Thread
          subject={this.props.subject}
          parentId={comment.id}
        />
      </li>
    );
  }
}
