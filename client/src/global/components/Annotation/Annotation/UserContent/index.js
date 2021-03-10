import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Helper from "global/components/helper";
import Utility from "frontend/components/utility";
import IconComposer from "global/components/utility/IconComposer";
import Editor from "../../Editor";
import Meta from "./Meta";
import CommentContainer from "global/containers/comment";
import classNames from "classnames";
import { annotationsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import pluralize from "pluralize";
import Authorize from "hoc/authorize";

const { request } = entityStoreActions;

class AnnotationDetail extends PureComponent {
  static displayName = "Annotation.Annotation.UserContent";

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    annotation: PropTypes.object.isRequired,
    showLogin: PropTypes.func,
    includeComments: PropTypes.bool.isRequired,
    showCommentsToggleAsBlock: PropTypes.bool
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

  stopAction = () => {
    this.setState({
      action: null
    });
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

  get listButtonBaseClassNames() {
    return "annotation-comments__inline-list-button";
  }

  get replyButtonClassNames() {
    return classNames({
      "annotation-comments__inline-list-button": true,
      "annotation-comments__inline-list-button--active":
        this.state.action === "replying"
    });
  }

  get editButtonClassNames() {
    return classNames({
      "annotation-comments__inline-list-button": true,
      "annotation-comments__inline-list-button--active":
        this.state.action === "editing"
    });
  }

  get secondaryButtonClassNames() {
    return classNames({
      "annotation-comments__inline-list-button": true,
      "annotation-comments__inline-list-button--secondary": true
    });
  }

  renderInlineCommentsToggle() {
    if (!this.showInlineCommentsToggle) return null;

    return (
      <li>
        <button
          className={this.editButtonClassNames}
          onClick={this.loadComments}
        >
          {`${this.commentsCount} ${this.commentsCountLabel}`}
        </button>
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
          <span className="annotation-footer-button__text">{`${this.commentsCount} ${this.commentsCountLabel}`}</span>
          <IconComposer
            icon="arrowLongRight16"
            size={24}
            iconClass="annotation-footer-button__arrow-icon"
          />
        </span>
      </button>
    );
  }

  render() {
    const { annotation } = this.props;
    if (!annotation) return null;

    const creator = this.props.annotation.relationships.creator;

    return (
      <>
        <li className="annotation-comments">
          <Meta
            annotation={annotation}
            creator={creator}
            includeMarkers={this.props.includeMarkers}
          />
          {this.state.action === "editing" ? (
            <Editor
              annotation={annotation}
              saveAnnotation={this.saveAnnotation}
              cancel={this.stopAction}
            />
          ) : (
            <div>
              <section className="annotation-comments__body">
                <Helper.SimpleFormat text={annotation.attributes.body} />
              </section>
              <Authorize kind={"any"}>
                <div className="annotation-comments__utility">
                  <ul className="annotation-comments__utility-list">
                    {this.includeComments ? (
                      <li>
                        <button
                          className={this.replyButtonClassNames}
                          onClick={this.startReply}
                        >
                          {"Reply"}
                        </button>
                      </li>
                    ) : null}
                    <Authorize entity={annotation} ability={"update"}>
                      <li>
                        <button
                          className={this.editButtonClassNames}
                          onClick={this.startEdit}
                        >
                          {"Edit"}
                        </button>
                      </li>
                    </Authorize>
                    <Authorize entity={annotation} ability={"delete"}>
                      <li>
                        <Utility.ConfirmableButton
                          label="Delete"
                          confirmHandler={this.deleteAnnotation}
                        />
                      </li>
                    </Authorize>
                    {annotation.attributes.flagged ? (
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
                    {this.renderInlineCommentsToggle()}
                  </ul>
                  {this.state.action === "replying" && (
                    <CommentContainer.Editor
                      subject={annotation}
                      cancel={this.stopAction}
                    />
                  )}
                </div>
              </Authorize>
              {this.props.showLogin && (
                <Authorize kind="unauthenticated">
                  <nav className="annotation-comments__utility">
                    <ul className="annotation-comments__utility-list">
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
              )}
            </div>
          )}
          <div
            ref={this.threadRef}
            tabIndex={-1}
            aria-label="Comments thread"
            className="annotation-comments__thread-container"
          >
            {this.includeComments && (
              <CommentContainer.Thread subject={annotation} />
            )}
          </div>
        </li>
        {this.renderBlockCommentsToggle()}
      </>
    );
  }
}

export default connect()(AnnotationDetail);
