import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { requests } from 'api';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { commentsAPI } from 'api';
const { request, flush } = entityStoreActions;
const { select, meta } = entityUtils;

class CommentEditor extends PureComponent {

  static displayName = "Comment.Editor";

  static mapStateToProps(state, ownProps) {
    const newState = {};
    return Object.assign({}, newState, ownProps);
  }

  static propTypes = {
    body: PropTypes.string,
    cancel: PropTypes.func.isRequired,
    subject: PropTypes.object.isRequired,
    parentId: PropTypes.string
  }

  constructor(props) {
    super(props);

    this.handleBodyChange = this.handleBodyChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      body: props.body ? props.body : "",
      isPrivate: false
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    const comment = {
      body: this.state.body,
      parentId: this.props.parentId
    };
    const call = commentsAPI.create(this.props.subject, comment);
    const options = { adds: `comments-for-${this.props.subject.id}` };
    this.props.dispatch(request(call, requests.rCommentCreate, options));
    this.props.cancel();
  }

  handleBodyChange(event) {
    this.setState({ body: event.target.value });
  }

  render() {

    const checkClass = classNames(
        'form-toggle',
        'checkbox',
        { checked: this.state.isPrivate }
    );

    const textClass = classNames({
      expanded: this.state.body
    });

    return (
      <div className="comment-editor">
        <form onSubmit={this.handleSubmit}>
          <textarea
            className={textClass}
            placeholder={'Reply to this annotation...'}
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
                Post
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(
  CommentEditor.mapStateToProps
)(CommentEditor);

