import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { requests } from "api";
import { entityStoreActions, uiVisibilityActions } from "actions";
import { singularEntityName } from "utils/entityUtils";
import { bindActionCreators } from "redux";
import { commentsAPI } from "api";
import { UIDConsumer } from "react-uid";
import * as Styled from "./styles";

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
    cancel: PropTypes.func,
    onSuccess: PropTypes.func,
    subject: PropTypes.object.isRequired,
    parentId: PropTypes.string,
    focus: PropTypes.bool,
    t: PropTypes.func,
    initialOpen: PropTypes.bool
  };

  static defaultProps = {
    focus: true,
    initialOpen: false
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(props);
    this.textArea = React.createRef();
    this.login = React.createRef();
  }

  componentDidMount() {
    if (this.state.open || !this.isComment(this.props)) {
      if (this.textArea.current) {
        this.textArea.current.focus();
      }
    }
  }

  componentDidUpdate() {
    if (this.state.open || !this.isComment(this.props)) {
      if (this.textArea.current) {
        this.textArea.current.focus();
        return;
      }
      if (this.login.current) {
        this.login.current.focus();
      }
    }
  }

  initialState(props) {
    const body = this.isEdit(props) ? props.comment.attributes.body : "";
    return {
      body,
      errors: [],
      open: props.initialOpen
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
    const options = { refreshes: `comments-for-${props.subject.id}` };
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
    if (this.props.cancel) this.props.cancel();
  }

  handleErrors(errors) {
    this.setState({ errors });
  }

  toggleOpen() {
    this.setState(state => {
      return { open: !state.open };
    });
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
    const t = props.t;
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

  formLabel(props) {
    const t = props.t;
    if (props.label) return props.label;
    if (this.isEdit(props)) return t("actions.edit");
    if (this.isReply(props)) return t("actions.reply");
  }

  toggleOpen = () =>
    this.setState(state => {
      return { open: !state.open };
    });

  render() {
    const showLogin = bindActionCreators(
      () => uiVisibilityActions.visibilityToggle("signInUpOverlay"),
      this.props.dispatch
    );

    const t = this.props.t;

    return (
      <Styled.Editor>
        {this.props.label ? (
          <Styled.Label
            onClick={this.toggleOpen}
            aria-expanded={this.state.open}
          >
            <Styled.Icon icon="interactComment24" size={24} />
            <span>{this.props.label}</span>
          </Styled.Label>
        ) : null}
        {(this.state.open || !this.isComment(this.props)) && (
          <>
            <Authorize kind="unauthenticated">
              <Styled.Placeholder onClick={showLogin} ref={this.login}>
                {t("placeholders.comments.unauthenticated")}
              </Styled.Placeholder>
            </Authorize>
            <Authorize kind="any">
              <form
                onSubmit={this.handleSubmit}
                aria-labelledby={this.formLabel(this.props)}
              >
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
                      <Styled.TextArea
                        ref={this.textArea}
                        id={`${this.idPrefix}-${id}`}
                        onKeyDown={this.submitOnReturnKey}
                        placeholder={this.placeholder(this.props)}
                        onChange={this.handleBodyChange}
                        value={this.state.body}
                        aria-describedby={`${this.idForErrorPrefix}-${id}`}
                      />
                      <Styled.Actions>
                        <Styled.Buttons>
                          <button
                            type="button"
                            onClick={this.props.cancel ?? this.toggleOpen}
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
                        </Styled.Buttons>
                      </Styled.Actions>
                    </GlobalForm.Errorable>
                  )}
                </UIDConsumer>
              </form>
            </Authorize>
          </>
        )}
      </Styled.Editor>
    );
  }
}

export default withTranslation()(
  connect(CommentEditor.mapStateToProps)(CommentEditor)
);
