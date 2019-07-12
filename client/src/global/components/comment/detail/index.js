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

  get listButtonBaseClassNames() {
    return "annotation-reply__list-button";
  }

  get replyButtonClassNames() {
    return classNames({
      "annotation-reply__list-button": true,
      "annotation-reply__list-button--active": this.state.replying
    });
  }

  get secondaryButtonClassNames() {
    return classNames({
      "annotation-reply__list-button": true,
      "annotation-reply__list-button--secondary": true
    });
  }

  renderComment() {
    const { comment, parent } = this.props;
    const { creator } = comment.relationships;

    return (
      <li className="annotation-reply">
        <Meta comment={comment} creator={creator} parent={parent} />
        <section className="annotation-reply__body">
          <Helper.SimpleFormat text={comment.attributes.body} />
        </section>
        <Authorize kind={"any"}>
          <nav className="annotation-reply__utility">
            <ul className="annotation-reply__utility-list">
              <li>
                <button
                  className={this.replyButtonClassNames}
                  onClick={this.startReply}
                >
                  {"Reply"}
                </button>
              </li>
              <Authorize entity={comment} ability={"update"}>
                <li>
                  <button
                    onClick={this.startEdit}
                    className={this.listButtonBaseClassNames}
                  >
                    {"Edit"}
                  </button>
                </li>
              </Authorize>
              <Authorize entity={comment} ability={"delete"}>
                {!comment.attributes.deleted ? (
                  <li>
                    <button
                      onClick={this.handleDelete}
                      className={this.listButtonBaseClassNames}
                    >
                      {"Delete"}
                    </button>
                  </li>
                ) : null}
              </Authorize>
              {comment.attributes.deleted ? (
                <li>
                  <button
                    onClick={this.handleRestore}
                    className={this.listButtonBaseClassNames}
                  >
                    {"Restore"}
                  </button>
                </li>
              ) : null}
              {comment.attributes.deleted ? (
                <li>
                  <button
                    onClick={this.handleDestroy}
                    className={this.listButtonBaseClassNames}
                  >
                    {"Destroy"}
                  </button>
                </li>
              ) : null}
              {comment.attributes.flagged ? (
                <li>
                  <button
                    className={this.secondaryButtonClassNames}
                    onClick={this.handleUnflag}
                  >
                    {"Unflag"}
                  </button>
                </li>
              ) : (
                <li>
                  <button
                    onClick={this.handleFlag}
                    className={this.listButtonBaseClassNames}
                  >
                    {"Flag"}
                  </button>
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
                <button
                  onClick={this.props.showLogin}
                  className={this.listButtonBaseClassNames}
                >
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
