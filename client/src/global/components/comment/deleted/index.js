import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";
import CommentContainer from "global/containers/comment";
import PropTypes from "prop-types";
import Avatar from "global/components/avatar/index";

class CommentDeleted extends PureComponent {
  static propTypes = {
    comment: PropTypes.object.isRequired,
    subject: PropTypes.object.isRequired,
    t: PropTypes.func
  };

  render() {
    const { comment, t } = this.props;
    return (
      <li className="annotation-reply">
        <section className="annotation-meta">
          <div>
            <div
              aria-hidden
              className="annotation-meta__avatar annotation-meta__avatar annotation-meta__avatar-placeholder-container"
            >
              <Avatar />
            </div>
            <h4 className="annotation-meta__deleted-message">
              {t("placeholders.comments.deleted")}
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

export default withTranslation()(CommentDeleted);
