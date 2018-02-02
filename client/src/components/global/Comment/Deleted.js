import React, { PureComponent } from "react";
import { Comment as CommentContainer } from "containers/global";
import PropTypes from "prop-types";

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
          <div>
            <figure className="author-avatar dull">
              <div className="no-image">
                <i className="manicon manicon-person" />
              </div>
            </figure>
            <h4 className="deleted-notification">This comment was deleted.</h4>
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
