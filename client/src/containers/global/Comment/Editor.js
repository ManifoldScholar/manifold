import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";
import { requests } from "api";
import { entityStoreActions, uiVisibilityActions } from "actions";
import { singularEntityName } from "utils/entityUtils";
import { bindActionCreators } from "redux";
import { commentsAPI } from "api";
import { HigherOrder } from "containers/global";
import uniqueId from "lodash/uniqueId";

const { request } = entityStoreActions;
import { Form as GlobalForm } from "components/global";

export class CommentEditor extends PureComponent {
  static displayName = "Comment.Editor";

  static mapStateToProps = (state, ownProps) => {
    const newState = {};
    return Object.assign({}, newState, ownProps);
  };

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
    id: PropTypes.string,
    idForError: PropTypes.string
  };

  static defaultProps = {
    focus: true,
    id: uniqueId("comment-textarea-"),
    idForError: uniqueId("comment-textarea-error-")
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
    this.setState(this.initialState());
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
    if (props.placeholder) return props.placeholder;
    if (this.isEdit(props)) return "Edit this comment...";
    if (this.isReply(props)) return "Reply to this comment...";
    if (this.isComment(props)) {
      return `Discuss this ${singularEntityName(props.subject)}...`;
    }
  }

  buttonLabel(props) {
    if (this.isEdit(props)) return "Update";
    return "Post";
  }

  render() {
    const textClass = classNames({
      expanded: this.state.body
    });
    const showLogin = bindActionCreators(
      () => uiVisibilityActions.visibilityToggle("signInUpOverlay"),
      this.props.dispatch
    );

    return (
      <div className="comment-editor">
        {this.props.label ? (
          <h3 className="editor-label">
            <i className="manicon manicon-pencil" aria-hidden="true" />
            {this.props.label}
          </h3>
        ) : null}
        <HigherOrder.Authorize kind="unauthenticated">
          <div className="placeholder">
            <button onClick={showLogin}>Login to post a comment</button>
          </div>
        </HigherOrder.Authorize>
        <HigherOrder.Authorize kind="any">
          <form onSubmit={this.handleSubmit}>
            <GlobalForm.Errorable
              name="attributes[body]"
              errors={this.state.errors}
              idForError={this.props.idForError}
            >
              <label htmlFor={this.props.id} className="screen-reader-text">
                {this.placeholder(this.props)}
              </label>
              <textarea
                ref={ci => {
                  this.ci = ci;
                }}
                id={this.props.id}
                onKeyDown={this.submitOnReturnKey}
                className={textClass}
                placeholder={this.placeholder(this.props)}
                onChange={this.handleBodyChange}
                value={this.state.body}
                aria-describedby={this.props.idForError}
              />
              <div className="utility">
                <div className="buttons">
                  <button
                    type="button"
                    onClick={this.props.cancel}
                    className="button-secondary-dull"
                  >
                    Cancel
                  </button>
                  <button
                    className="button-secondary"
                    disabled={!this.state.body}
                  >
                    <i
                      className="manicon manicon-word-bubble-lines"
                      aria-hidden="true"
                    />
                    {this.buttonLabel(this.props)}
                  </button>
                </div>
              </div>
            </GlobalForm.Errorable>
          </form>
        </HigherOrder.Authorize>
      </div>
    );
  }
}

export default connect(CommentEditor.mapStateToProps)(CommentEditor);
