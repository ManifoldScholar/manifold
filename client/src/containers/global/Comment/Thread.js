import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { requests } from 'api';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { Utility } from 'components/frontend';
import Annotation from 'components/reader/Annotation';
const { request, flush } = entityStoreActions;
const { select, meta } = entityUtils;

class CommentThread extends PureComponent {

  static mapStateToProps(state, ownProps) {
    const newState = {
    };
    return Object.assign({}, newState, ownProps);
  }
  render() {
    return (
      <div className="annotation-comment-thread">
        <ul className="comment-list">
          {/* Iterate through available comments and render a comment.detail */}
          <Annotation.Comment.Detail />
          <Annotation.Comment.Detail />
        </ul>
      </div>
    );
  }
}


export default connect(
  CommentThread.mapStateToProps
)(CommentThread);

