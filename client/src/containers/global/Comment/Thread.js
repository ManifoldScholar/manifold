import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { requests } from 'api';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { Comment } from 'components/global';
import { Utility } from 'components/frontend';
import { commentsAPI } from 'api';
import Annotation from 'components/reader/Annotation';
const { request, flush } = entityStoreActions;
const { select, meta } = entityUtils;

class CommentThread extends PureComponent {

  static mapStateToProps(state, ownProps) {
    const newState = {
      comments: select(`comments-for-${ownProps.subject.id}`, state.entityStore),
    };
    return Object.assign({}, ownProps, newState);
  }

  static propTypes = {
    subject: PropTypes.object.isRequired,
    parentId: PropTypes.string,
    parentAuthor: PropTypes.string
  }

  static defaultProps = {
    parentId: null
  }

  componentDidMount() {
    if (this.props.subject && !this.props.comments) {
      const call = commentsAPI.index(this.props.subject);
      this.props.dispatch(request(call, `comments-for-${this.props.subject.id}`));
    }
  }

  childrenOf(parentId) {
    const children = this.props.comments.filter((c) => c.attributes.parentId === parentId);
    return children;
  }

  render() {
    if (!this.props.comments) return null;
    const children = this.childrenOf(this.props.parentId);
    if (children.length <= 0) return null;

    return (
      <div className="annotation-comment-thread">
        <ul className="comment-list">
          {children.map((comment) => {
            return (
              <Comment.Detail
                subject={this.props.subject}
                key={comment.id}
                comment={comment}
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

