import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import CommentContainer from "global/containers/comment";
import Meta from "global/components/comment/meta";
import Deleted from "global/components/comment/deleted";
import Helper from "global/components/helper";
import * as Styled from "global/components/Annotation/Annotation/UserContent/styles";

import Authorize from "hoc/Authorize";

class CommentDetail extends PureComponent {
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
    parent: PropTypes.object,
    t: PropTypes.func
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
    const { comment, parent, t } = this.props;
    const { creator } = comment.relationships;

    return (
      <li className="annotation-reply">
        <Meta comment={comment} creator={creator} parent={parent} />
        <Styled.Body>
          <Helper.SimpleFormat text={comment.attributes.body} />
        </Styled.Body>
        <Authorize kind={"any"}>
          <Styled.Utility>
            <Styled.UtilityList>
              <li>
                <Styled.Button
                  onClick={this.startReply}
                  aria-expanded={this.state.editor === "reply"}
                >
                  {t("actions.reply")}
                </Styled.Button>
              </li>
              <Authorize entity={comment} ability={"update"}>
                <li>
                  <Styled.Button
                    onClick={this.startEdit}
                    aria-expanded={this.state.editor === "edit"}
                  >
                    {t("actions.edit")}
                  </Styled.Button>
                </li>
              </Authorize>
              <Authorize entity={comment} ability={"delete"}>
                {!comment.attributes.deleted ? (
                  <li>
                    <Styled.Button onClick={this.handleDelete}>
                      {t("actions.delete")}
                    </Styled.Button>
                  </li>
                ) : null}
              </Authorize>
              {comment.attributes.deleted ? (
                <li>
                  <Styled.Button>{t("actions.restore")}</Styled.Button>
                </li>
              ) : null}
              {comment.attributes.deleted ? (
                <li>
                  <Styled.Button onClick={this.handleDestroy}>
                    {t("actions.destroy")}
                  </Styled.Button>
                </li>
              ) : null}
              {comment.attributes.flagged ? (
                <li>
                  <Styled.SecondaryButton onClick={this.handleUnflag}>
                    {t("actions.unflag")}
                  </Styled.SecondaryButton>
                </li>
              ) : (
                <li>
                  <Styled.Button onClick={this.handleFlag}>
                    {t("actions.flag")}
                  </Styled.Button>
                </li>
              )}
            </Styled.UtilityList>
            {this.renderEditor()}
          </Styled.Utility>
        </Authorize>
        <Authorize kind="unauthenticated">
          <Styled.Utility>
            <Styled.UtilityList>
              <li>
                <Styled.Button onClick={this.props.showLogin}>
                  {t("actions.login_to_reply")}
                </Styled.Button>
              </li>
            </Styled.UtilityList>
          </Styled.Utility>
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

export default withTranslation()(CommentDetail);
