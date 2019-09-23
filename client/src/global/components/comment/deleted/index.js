import React, { PureComponent } from "react";
import CommentContainer from "global/containers/comment";
import PropTypes from "prop-types";
import Avatar from "global/components/avatar/index";

export default class CommentDeleted extends PureComponent {
  static propTypes = {
    comment: PropTypes.object.isRequired,
    subject: PropTypes.object.isRequired
  };

  render() {
    const { comment } = this.props;
    return (
      <li className="annotation-reply">
        <section className="annotation-meta">
          <div>
            <div className="annotation-meta__avatar annotation-meta__avatar annotation-meta__avatar-placeholder-container">
              <Avatar />
            </div>
            <h4 className="annotation-meta__deleted-message">
              This comment was deleted.
            </h4>
          </div>
        </section>
        <CommentContainer.Thread
          subject={this.props.subject}
          parentId={comment.id}
        />
      </li>
    );
  }
}
