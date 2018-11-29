import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import CommentContainer from "global/containers/comment";
import Meta from "global/components/comment/meta";
import Deleted from "global/components/comment/deleted";
import Helper from "global/components/helper";
import classNames from "classnames";

import Authorize from "hoc/authorize";

export default class CommentDetail extends PureComponent {
  static displayName = "Comment.Detail";

  static propTypes = {
    subject: PropTypes.object.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleDestroy: PropTypes.func.isRequired,
    handleRestore: PropTypes.func.isRequired,
    handleFlag: PropTypes.func.isRequired,
    comment: PropTypes.object.isRequired,
    showLogin: PropTypes.func,
    handleUnflag: PropTypes.func,
    parent: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      editor: null
    };
  }

  handleFlag = event => {
    this.props.handleFlag(event, this.props.comment);
  };

  handleUnflag = event => {
    this.props.handleUnflag(event, this.props.comment);
  };

  handleDelete = event => {
    this.props.handleDelete(event, this.props.comment);
  };

  handleRestore = event => {
    this.props.handleRestore(event, this.props.comment);
  };

  handleDestroy = event => {
    this.props.handleDestroy(event, this.props.comment);
  };

  startEdit = () => {
    this.setState(
      {
        editor: null
      },
      () => {
        this.setState({
          editor: "edit"
        });
      }
    );
  };

  startReply = () => {
    this.setState(
      {
        editor: null
      },
      () => {
        this.setState({
          editor: "reply"
        });
      }
    );
  };

  closeEditor = () => {
    this.setState({
      editor: null
    });
  };

  renderEditor() {
    if (!this.state.editor) return null;
    if (this.state.editor === "reply") return this.renderReplyEditor();
    if (this.state.editor === "edit") return this.renderEditEditor();
    return null;
  }

  renderReplyEditor() {
    return (
      <CommentContainer.Editor
        subject={this.props.subject}
        parentId={this.props.comment.id}
        cancel={this.closeEditor}
      />
    );
  }

  renderEditEditor() {
    return (
      <CommentContainer.Editor
        comment={this.props.comment}
        subject={this.props.subject}
        cancel={this.closeEditor}
      />
    );
  }

  renderComment() {
    const replyButtonClass = classNames({
      active: this.state.replying
    });
    const { comment, parent } = this.props;
    const { creator } = comment.relationships;

    return (
      <li className="annotation-comment">
        <Meta comment={comment} creator={creator} parent={parent} />
        <section className="body">
          <Helper.SimpleFormat text={comment.attributes.body} />
        </section>
        <Authorize kind={"any"}>
          <nav className="utility">
            <ul>
              <li>
                <button className={replyButtonClass} onClick={this.startReply}>
                  {"Reply"}
                </button>
              </li>
              <Authorize entity={comment} ability={"update"}>
                <li>
                  <button onClick={this.startEdit}>{"Edit"}</button>
                </li>
              </Authorize>
              <Authorize entity={comment} ability={"delete"}>
                {!comment.attributes.deleted ? (
                  <li>
                    <button onClick={this.handleDelete}>{"Delete"}</button>
                  </li>
                ) : null}
              </Authorize>
              {comment.attributes.deleted ? (
                <li>
                  <button onClick={this.handleRestore}>{"Restore"}</button>
                </li>
              ) : null}
              {comment.attributes.deleted ? (
                <li>
                  <button onClick={this.handleDestroy}>{"Destroy"}</button>
                </li>
              ) : null}
              {comment.attributes.flagged ? (
                <li>
                  <button className="secondary" onClick={this.handleUnflag}>
                    {"Unflag"}
                  </button>
                </li>
              ) : (
                <li>
                  <button onClick={this.handleFlag}>{"Flag"}</button>
                </li>
              )}
            </ul>
            {this.renderEditor()}
          </nav>
        </Authorize>
        <Authorize kind="unauthenticated">
          <nav className="utility">
            <ul>
              <li>
                <button onClick={this.props.showLogin}>
                  {"Login to reply"}
                </button>
              </li>
            </ul>
          </nav>
        </Authorize>
        <CommentContainer.Thread
          subject={this.props.subject}
          parent={this.props.comment}
          parentId={comment.id}
        />
      </li>
    );
  }

  render() {
    const { comment } = this.props;
    const { attributes } = comment;
    if (attributes.deleted && !attributes.abilities.readDeleted) {
      return <Deleted comment={comment} subject={this.props.subject} />;
    }
    return this.renderComment();
  }
}
