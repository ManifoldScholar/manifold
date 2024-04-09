import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import Helper from "global/components/helper";
import Utility from "frontend/components/utility";
import IconComposer from "global/components/utility/IconComposer";
import Editor from "../../Editor";
import Meta from "./Meta";
import CommentContainer from "global/containers/comment";
import { annotationsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import pluralize from "pluralize";
import Authorize from "hoc/Authorize";
import * as Styled from "./styles";

const { request } = entityStoreActions;

class AnnotationDetail extends PureComponent {
  static displayName = "Annotation.Annotation.UserContent";

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    annotation: PropTypes.object.isRequired,
    showLogin: PropTypes.func,
    includeComments: PropTypes.bool.isRequired,
    showCommentsToggleAsBlock: PropTypes.bool,
    t: PropTypes.func
  };

  static defaultProps = {
    includeComments: true
  };

  constructor(props) {
    super(props);
    this.state = {
      action: null,
      includeComments: this.props.includeComments && this.canIncludeComments
    };
    this.threadRef = React.createRef();
    this.replyToggleRef = React.createRef();
    this.editToggleRef = React.createRef();
  }

  startReply = () => {
    this.setState({
      action: "replying"
    });
  };

  startEdit = () => {
    this.setState({
      action: "editing"
    });
  };

  stopReply = () => {
    this.setState(
      {
        action: null
      },
      () => {
        if (this.replyToggleRef.current) this.replyToggleRef.current.focus();
      }
    );
  };

  stopEdit = () => {
    this.setState(
      {
        action: null
      },
      () => {
        if (this.editToggleRef.current) this.editToggleRef.current.focus();
      }
    );
  };

  handleFlag = () => {
    const { annotation } = this.props;
    const call = annotationsAPI.flag(annotation);
    this.props.dispatch(request(call, requests.rAnnotationFlag));
  };

  handleUnflag = () => {
    const { annotation } = this.props;
    const call = annotationsAPI.unflag(annotation);
    this.props.dispatch(request(call, requests.rAnnotationUnflag));
  };

  saveAnnotation = annotation => {
    const call = annotationsAPI.update(annotation.id, annotation.attributes);
    const res = this.props.dispatch(request(call, requests.rAnnotationUpdate));
    return res.promise;
  };

  deleteAnnotation = () => {
    const { annotation } = this.props;
    const call = annotationsAPI.destroy(annotation.id);
    const options = { removes: { type: "annotations", id: annotation.id } };
    const res = this.props.dispatch(
      request(call, requests.rAnnotationDestroy, options)
    );
    return res.promise;
  };

  loadComments = () => {
    this.setState({ includeComments: true });

    if (!this.threadRef?.current) return;
    this.threadRef.current.focus();
  };

  get commentsCount() {
    return this.props.annotation.attributes.commentsCount;
  }

  get commentsCountLabel() {
    const root = "comment";
    return this.commentsCount === 1 ? root : pluralize(root);
  }

  get canIncludeComments() {
    const { annotation } = this.props;
    if (!annotation) return false;
    return annotation.attributes.readingGroupPrivacy !== "anonymous";
  }

  get includeComments() {
    return this.canIncludeComments && this.state.includeComments;
  }

  get hasComments() {
    return this.commentsCount > 0;
  }

  get showCommentsToggleAsBlock() {
    return this.props.showCommentsToggleAsBlock;
  }

  get showInlineCommentsToggle() {
    return (
      !this.includeComments &&
      this.hasComments &&
      !this.showCommentsToggleAsBlock
    );
  }

  get showBlockCommentsToggle() {
    return (
      !this.includeComments &&
      this.hasComments &&
      this.showCommentsToggleAsBlock
    );
  }

  renderInlineCommentsToggle() {
    if (!this.showInlineCommentsToggle) return null;

    return (
      <li>
        <Styled.Button
          onClick={this.loadComments}
          $active={this.state.action === "editing"}
        >
          {this.props.t("counts.comment", { count: this.commentsCount })}
        </Styled.Button>
      </li>
    );
  }

  renderBlockCommentsToggle() {
    if (!this.showBlockCommentsToggle) return null;

    return (
      <button className="annotation-footer-button" onClick={this.loadComments}>
        <span className="annotation-footer-button__inner">
          <span className="annotation-footer-button__icon-container">
            <IconComposer icon="interactComment32" size="default" />
          </span>
          <span className="annotation-footer-button__text">
            {this.props.t("counts.comment", { count: this.commentsCount })}
          </span>
          <IconComposer
            icon="arrowLongRight16"
            size={24}
            className="annotation-footer-button__arrow-icon"
          />
        </span>
      </button>
    );
  }

  render() {
    const { annotation, t } = this.props;
    if (!annotation) return null;

    const creator = this.props.annotation.relationships.creator;

    return (
      <>
        <li className="annotation-comments">
          <Styled.Inner>
            <Meta
              annotation={annotation}
              creator={creator}
              includeMarkers={this.props.includeMarkers}
            />
            {this.state.action === "editing" ? (
              <Editor
                annotation={annotation}
                saveAnnotation={this.saveAnnotation}
                cancel={this.stopEdit}
              />
            ) : (
              <div>
                <Styled.Body>
                  <Helper.SimpleFormat text={annotation.attributes.body} />
                </Styled.Body>
                <Authorize kind={"any"}>
                  <Styled.Utility>
                    <Styled.UtilityList
                      $isFlagged={annotation.attributes.flagged}
                    >
                      {this.includeComments ? (
                        <Authorize entity={"comment"} ability={"create"}>
                          <li>
                            <Styled.Button
                              ref={this.replyToggleRef}
                              onClick={
                                this.state.action === "replying"
                                  ? this.stopReply
                                  : this.startReply
                              }
                              aria-expanded={this.state.action === "replying"}
                            >
                              {t("actions.reply")}
                            </Styled.Button>
                          </li>
                        </Authorize>
                      ) : null}
                      <Authorize entity={annotation} ability={"update"}>
                        <li>
                          <Styled.Button
                            ref={this.editToggleRef}
                            onClick={this.startEdit}
                            aria-expanded={this.state.action === "editing"}
                          >
                            {t("actions.edit")}
                          </Styled.Button>
                        </li>
                      </Authorize>
                      <Authorize entity={annotation} ability={"delete"}>
                        <li>
                          <Utility.ConfirmableButton
                            label={t("actions.delete")}
                            confirmHandler={this.deleteAnnotation}
                          />
                        </li>
                      </Authorize>
                      <li>
                        <Styled.SecondaryButton
                          onClick={
                            annotation.attributes.flagged
                              ? this.handleUnflag
                              : this.handleFlag
                          }
                          aria-pressed={annotation.attributes.flagged}
                        >
                          {annotation.attributes.flagged
                            ? t("actions.unflag")
                            : t("actions.flag")}
                        </Styled.SecondaryButton>
                      </li>
                      {this.renderInlineCommentsToggle()}
                    </Styled.UtilityList>
                    {this.state.action === "replying" && (
                      <CommentContainer.Editor
                        subject={annotation}
                        cancel={this.stopReply}
                        initialOpen
                      />
                    )}
                  </Styled.Utility>
                </Authorize>
                {this.props.showLogin && (
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
                )}
              </div>
            )}
            <div
              ref={this.threadRef}
              tabIndex={-1}
              aria-label={t("glossary.comments__thread")}
              className="annotation-comments__thread-container"
            >
              {this.includeComments && (
                <CommentContainer.Thread subject={annotation} />
              )}
            </div>
          </Styled.Inner>
        </li>
        {this.renderBlockCommentsToggle()}
      </>
    );
  }
}

export default withTranslation()(connect()(AnnotationDetail));
