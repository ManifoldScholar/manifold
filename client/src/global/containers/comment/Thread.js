import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { requests } from "api";
import { entityStoreActions, uiVisibilityActions } from "actions";
import { bindActionCreators } from "redux";
import { select, meta } from "utils/entityUtils";
import Detail from "global/components/comment/detail";
import { commentsAPI } from "api";
import Utility from "global/components/utility";

const { request } = entityStoreActions;
const perPage = 50;

export class CommentThread extends PureComponent {
  static mapStateToProps = (state, ownProps) => {
    const newState = {
      comments: select(
        `comments-for-${ownProps.subject.id}`,
        state.entityStore
      ),
      commentsMeta: meta(
        `comments-for-${ownProps.subject.id}`,
        state.entityStore
      )
    };
    return { ...ownProps, ...newState };
  };

  static propTypes = {
    subject: PropTypes.object.isRequired,
    parentId: PropTypes.string,
    parent: PropTypes.object,
    comments: PropTypes.array,
    commentsMeta: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  static defaultProps = {
    parentId: null
  };

  componentDidMount() {
    if (this.props.subject && !this.props.comments) {
      this.fetchComments({ number: 1, size: 1 });
    }
  }

  fetchComments = (page = {}) => {
    const call = commentsAPI.index(this.props.subject, {}, page);
    const commentRequest = `comments-for-${this.props.subject.id}`;
    const options = { appends: commentRequest };
    this.props.dispatch(request(call, commentRequest, options));
  };

  handleCommentDestroy = (event, comment) => {
    const call = commentsAPI.destroy(comment);
    const options = { removes: { type: "comments", id: comment.id } };
    this.props.dispatch(request(call, requests.rCommentDestroy, options));
  };

  handleCommentDelete = (event, comment) => {
    const call = commentsAPI.update(comment.id, { deleted: true });
    this.props.dispatch(
      request(call, requests.rCommentUpdate, {
        refreshes: `comments-for-${this.props.subject.id}`
      })
    );
  };

  handleCommentRestore = (event, comment) => {
    const call = commentsAPI.update(comment.id, { deleted: false });
    this.props.dispatch(
      request(call, requests.rCommentUpdate, {
        refreshes: `comments-for-${this.props.subject.id}`
      })
    );
  };

  handleCommentFlag = (event, comment) => {
    const call = commentsAPI.flag(comment);
    this.props.dispatch(
      request(call, requests.rCommentFlag, {
        refreshes: `comments-for-${this.props.subject.id}`
      })
    );
  };

  handleCommentUnflag = (event, comment) => {
    const call = commentsAPI.unflag(comment);
    this.props.dispatch(
      request(call, requests.rCommentUnflag, {
        refreshes: `comments-for-${this.props.subject.id}`
      })
    );
  };

  handleNextClick = pagination => {
    const nextPage =
      pagination.perPage === 1 ? pagination.currentPage : pagination.nextPage;
    this.fetchComments({ number: nextPage, size: perPage });
  };

  childrenOf(parentId) {
    const children = this.props.comments.filter(
      c => c.attributes.parentId === parentId
    );
    return children;
  }

  renderViewNext(commentsPagination) {
    const currentCount =
      commentsPagination.currentPage * commentsPagination.perPage;
    const nextCount =
      currentCount + perPage <= commentsPagination.totalCount
        ? perPage
        : commentsPagination.totalCount - currentCount;
    return (
      <button
        className="comment-more"
        onClick={() => this.handleNextClick(commentsPagination)}
      >
        {this.props.t("actions.see_next_comment", { count: nextCount })}
        <Utility.IconComposer
          icon="disclosureDown16"
          size={16}
          className="comment-more__icon"
        />
      </button>
    );
  }

  renderViewMore(commentsPagination) {
    if (!commentsPagination) return null;
    if (commentsPagination.totalPages > commentsPagination.currentPage)
      return this.renderViewNext(commentsPagination);
  }

  render() {
    if (!this.props.comments || !Array.isArray(this.props.comments))
      return null;
    const children = this.childrenOf(this.props.parentId);
    if (children.length <= 0) return null;
    const showLogin = bindActionCreators(
      () => uiVisibilityActions.visibilityToggle("signInUpOverlay"),
      this.props.dispatch
    );

    return (
      <div className="annotation-comment-thread">
        <ul className="comment-list">
          {children.map(comment => {
            return (
              <Detail
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
        {this.props.parentId
          ? null
          : this.renderViewMore(this.props.commentsMeta.pagination)}
      </div>
    );
  }
}

export default withTranslation()(
  connect(CommentThread.mapStateToProps)(CommentThread)
);
