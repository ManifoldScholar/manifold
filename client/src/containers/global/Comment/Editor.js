import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { requests } from 'api';
import { entityStoreActions } from 'actions';
import { select, meta, singularEntityName } from 'utils/entityUtils';
import { commentsAPI } from 'api';
const { request } = entityStoreActions;
import { Form as GlobalForm } from 'components/global';

export class CommentEditor extends PureComponent {

  static displayName = "Comment.Editor";

  static mapStateToProps(state, ownProps) {
    const newState = {};
    return Object.assign({}, newState, ownProps);
  }

  static propTypes = {
    comment: PropTypes.object,
    placeholder: PropTypes.string,
    body: PropTypes.string,
    cancel: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    subject: PropTypes.object.isRequired,
    parentId: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.handleBodyChange = this.handleBodyChange.bind(this);
    this.submitOnReturnKey = this.submitOnReturnKey.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = this.initialState();
    if (this.isEdit(props)) this.state.body = props.comment.attributes.body;
  }

  initialState() {
    return {
      body: "",
      errors: []
    };
  }

  componentDidMount() {
    if (!this.ci) return null;
    this.ci.focus();
  }

  submitOnReturnKey(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      this.handleSubmit(event);
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.isEdit(this.props)) return this.updateComment(this.props, this.state);
    return this.createComment(this.props, this.state);
  }

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
    this.props.dispatch(apiRequest).promise.then(() => {
      this.handleSuccess();
    }, (response) => {
      this.handleErrors(response.body.errors);
    });
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

  handleBodyChange(event) {
    this.setState({ body: event.target.value });
  }

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

    return (
      <div className="comment-editor">
        <form onSubmit={this.handleSubmit}>
          <GlobalForm.Errorable
            name="attributes[body]"
            errors={this.state.errors}
          >
            <textarea
              ref={(ci) => { this.ci = ci; }}
              onKeyDown={this.submitOnReturnKey}
              className={textClass}
              placeholder={this.placeholder(this.props)}
              onChange={this.handleBodyChange}
              value={this.state.body}
            />
          <div className="utility">
            <div className="buttons">
              <button
                onClick={this.props.cancel}
                className="button-secondary-dull"
              >
                Cancel
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
        </form>
      </div>
    );
  }
}

export default connect(
  CommentEditor.mapStateToProps
)(CommentEditor);

