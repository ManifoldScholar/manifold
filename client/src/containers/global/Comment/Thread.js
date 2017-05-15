import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { requests } from 'api';
import { entityStoreActions, uiVisibilityActions } from 'actions';
import { bindActionCreators } from 'redux';
import { select } from 'utils/entityUtils';
import { Comment } from 'components/global';
import { Utility } from 'components/frontend';
import { commentsAPI } from 'api';
const { request } = entityStoreActions;

export class CommentThread extends PureComponent {

  static mapStateToProps(state, ownProps) {
    const newState = {
      comments: select(`comments-for-${ownProps.subject.id}`, state.entityStore),
    };
    return Object.assign({}, ownProps, newState);
  }

  static propTypes = {
    subject: PropTypes.object.isRequired,
    parentId: PropTypes.string,
    parent: PropTypes.object
  };

  static defaultProps = {
    parentId: null
  };

  constructor(props) {
    super(props);
    this.handleCommentDelete = this.handleCommentDelete.bind(this);
    this.handleCommentDestroy = this.handleCommentDestroy.bind(this);
    this.handleCommentRestore = this.handleCommentRestore.bind(this);
    this.handleCommentFlag = this.handleCommentFlag.bind(this);
    this.handleCommentUnflag = this.handleCommentUnflag.bind(this);
  }

  componentDidMount() {
    if (this.props.subject && !this.props.comments) {
      const call = commentsAPI.index(this.props.subject);
      this.props.dispatch(request(call, `comments-for-${this.props.subject.id}`));
    }
  }

  handleCommentDestroy(event, comment) {
    const call = commentsAPI.destroy(comment);
    const options = { removes: { type: "comments", id: comment.id } };
    this.props.dispatch(request(call, requests.rCommentDestroy, options));
  }

  handleCommentDelete(event, comment) {
    const call = commentsAPI.update(comment.id, { deleted: true });
    this.props.dispatch(request(call, requests.rCommentUpdate));
  }

  handleCommentRestore(event, comment) {
    const call = commentsAPI.update(comment.id, { deleted: false });
    this.props.dispatch(request(call, requests.rCommentUpdate));
  }

  handleCommentFlag(event, comment) {
    const call = commentsAPI.flag(comment);
    this.props.dispatch(request(call, requests.rCommentFlag));
  }

  handleCommentUnflag(event, comment) {
    const call = commentsAPI.unflag(comment);
    this.props.dispatch(request(call, requests.rCommentUnflag));
  }

  childrenOf(parentId) {
    const children = this.props.comments.filter((c) => c.attributes.parentId === parentId);
    return children;
  }

  render() {
    if (!this.props.comments || !Array.isArray(this.props.comments)) return null;
    const children = this.childrenOf(this.props.parentId);
    if (children.length <= 0) return null;
    const showLogin = bindActionCreators(
      () => uiVisibilityActions.visibilityToggle('signInUpOverlay'),
      this.props.dispatch
    );

    return (
      <div className="annotation-comment-thread">
        <ul className="comment-list">
          {children.map((comment) => {
            return (
              <Comment.Detail
                subject={this.props.subject}
                key={comment.id}
                comment={comment}
                parent={this.props.parent}
                checkForChildren={this.checkForChildren}
                handleDelete={this.handleCommentDelete}
                handleRestore={this.handleCommentRestore}
                handleDestroy={this.handleCommentDestroy}
                handleFlag={this.handleCommentFlag}
                handleUnflag={this.handleCommentUnflag}
                showLogin={showLogin}
              />
            );
          })}
        </ul>
      </div>
    );
  }
}


export default connect(
  CommentThread.mapStateToProps
)(CommentThread);

