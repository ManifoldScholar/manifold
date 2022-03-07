import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import classNames from "classnames";
import { connect } from "react-redux";
import { requests } from "api";
import { entityStoreActions, uiVisibilityActions } from "actions";
import { singularEntityName } from "utils/entityUtils";
import { bindActionCreators } from "redux";
import { commentsAPI } from "api";
import { UIDConsumer } from "react-uid";
import IconComposer from "global/components/utility/IconComposer";

const { request } = entityStoreActions;
import GlobalForm from "global/components/form";

import Authorize from "hoc/Authorize";

export class CommentEditor extends PureComponent {
  static mapStateToProps = (state, ownProps) => {
    const newState = {};
    return { ...newState, ...ownProps };
  };

  static displayName = "Comment.Editor";

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    label: PropTypes.string,
    comment: PropTypes.object,
    placeholder: PropTypes.string,
    body: PropTypes.string,
    cancel: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    subject: PropTypes.object.isRequired,
    parentId: PropTypes.string,
    focus: PropTypes.bool,
    t: PropTypes.bool
  };

  static defaultProps = {
    focus: true
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(props);
  }

  componentDidMount() {
    if (!this.ci) return null;
    if (this.props.focus) {
      this.ci.focus();
    }
  }

  initialState(props) {
    const body = this.isEdit(props) ? props.comment.attributes.body : "";
    return {
      body,
      errors: []
    };
  }

  get idPrefix() {
    return "comment-textarea";
  }

  get idForErrorPrefix() {
    return "comment-textarea-error";
  }

  submitOnReturnKey = event => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      this.handleSubmit(event);
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isEdit(this.props))
      return this.updateComment(this.props, this.state);
    return this.createComment(this.props, this.state);
  };

  createComment(props, state) {
    const comment = this.commentFromPropsAndState(props, state);
    const call = commentsAPI.create(props.subject, comment);
    const options = { adds: `comments-for-${props.subject.id}` };
    const createRequest = request(call, requests.rCommentCreate, options);
    this.processRequest(createRequest);
  }

  updateComment(props, state) {
    const comment = this.commentFromPropsAndState(props, state);
    const call = commentsAPI.update(props.comment.id, comment);
    const options = { adds: `comments-for-${props.subject.id}` };
    const updateRequest = request(call, requests.rCommentCreate, options);
    this.processRequest(updateRequest);
  }

  processRequest(apiRequest) {
    this.props.dispatch(apiRequest).promise.then(
      () => {
        this.handleSuccess();
      },
      response => {
        this.handleErrors(response.body.errors);
      }
    );
  }

  commentFromPropsAndState(props, state) {
    return {
      body: state.body,
      parentId: props.parentId
    };
  }

  handleSuccess() {
    this.setState(this.initialState(this.props));
    this.props.cancel();
  }

  handleErrors(errors) {
    this.setState({ errors });
  }

  handleBodyChange = event => {
    this.setState({ body: event.target.value });
  };

  isEdit(props) {
    return this.mode(props) === "edit";
  }

  isReply(props) {
    return this.mode(props) === "reply";
  }

  isComment(props) {
    return this.mode(props) === "comment";
  }

  mode(props) {
    if (props.comment) return "edit";
    if (props.parentId) return "reply";
    return "comment";
  }

  placeholder(props) {
    const t = this.props.t;
    if (props.placeholder) return props.placeholder;
    if (this.isEdit(props)) return t("placeholders.comments.edit");
    if (this.isReply(props)) return t("placeholders.comments.reply");
    if (this.isComment(props)) {
      return t("placeholders.comments.discuss_entity", {
        entity: singularEntityName(props.subject)
      });
    }
  }

  buttonLabel(props) {
    const t = this.props.t;
    if (this.isEdit(props)) return t("actions.update");
    return t("actions.post");
  }

  render() {
    const textareaClass = classNames({
      "annotation-editor__textarea": true,
      "annotation-editor__textarea--expanded": this.state.body
    });
    const showLogin = bindActionCreators(
      () => uiVisibilityActions.visibilityToggle("signInUpOverlay"),
      this.props.dispatch
    );

    const t = this.props.t;

    return (
      <div className="annotation-editor">
        {this.props.label ? (
          <h2 className="annotation-editor__editor-label">
            <IconComposer
              icon="commentPencil32"
              size={42}
              className="annotation-editor__label-icon"
            />
            <span className="annotation-editor__label-text">
              {this.props.label}
            </span>
          </h2>
        ) : null}
        <Authorize kind="unauthenticated">
          <div className="placeholder">
            <button onClick={showLogin}>
              {t("placeholders.comments.unauthenticated")}
            </button>
          </div>
        </Authorize>
        <Authorize kind="any">
          <form onSubmit={this.handleSubmit}>
            <UIDConsumer>
              {id => (
                <GlobalForm.Errorable
                  name="attributes[body]"
                  errors={this.state.errors}
                  idForError={`${this.idForErrorPrefix}-${id}`}
                >
                  <label
                    htmlFor={`${this.idPrefix}-${id}`}
                    className="screen-reader-text"
                  >
                    {this.placeholder(this.props)}
                  </label>
                  <textarea
                    ref={ci => {
                      this.ci = ci;
                    }}
                    id={`${this.idPrefix}-${id}`}
                    onKeyDown={this.submitOnReturnKey}
                    className={textareaClass}
                    placeholder={this.placeholder(this.props)}
                    onChange={this.handleBodyChange}
                    value={this.state.body}
                    aria-describedby={`${this.idForErrorPrefix}-${id}`}
                  />
                  <div className="annotation-editor__actions">
                    <div className="annotation-editor__buttons">
                      <button
                        type="button"
                        onClick={this.props.cancel}
                        className="button-primary button-primary--gray"
                      >
                        {t("actions.cancel")}
                      </button>
                      <button
                        className="button-secondary"
                        disabled={!this.state.body}
                      >
                        {this.buttonLabel(this.props)}
                      </button>
                    </div>
                  </div>
                </GlobalForm.Errorable>
              )}
            </UIDConsumer>
          </form>
        </Authorize>
      </div>
    );
  }
}

export default withTranslation()(
  connect(CommentEditor.mapStateToProps)(CommentEditor)
);
