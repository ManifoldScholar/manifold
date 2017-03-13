import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { requests } from 'api';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { Utility } from 'components/frontend';
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
          <li className="annotation-comment">
            <section className="meta">
              <div>
                <figure className="author-avatar dull">
                  <i className="manicon manicon-person"></i>
                </figure>
                <h4 className="author-name">
                  Zach Davis
                  <span className="reply-to">
                    <i className="manicon manicon-arrow-curved-right"></i>
                    Reply to Me
                  </span>
                </h4>
                <datetime>
                  1 day ago
                </datetime>
              </div>
            </section>
            <section className="body">
              {'Nullam id dolor id nibh ultricies vehicula ut id elit. Aenean eu' +
              ' leo quam. Pellentesque ornare sem lacinia quam venenatis ' +
              'vestibulum. Vestibulum id ligula porta felis euismod semper.'}
            </section>
            <nav className="utility">
              <ul>
                <li>
                  <button>{'Reply'}</button>
                </li>
                <li>
                  <Utility.ShareBar url="#"/>
                </li>
                <li>
                  <button>{'Flag'}</button>
                </li>
              </ul>
            </nav>
            {/*
             NB: Nested comment thread would go here with the exact
             same markup as this one, starting with
             <div className="annotation-comment-thread">
             */}
          </li>
          <li className="annotation-comment">
            <section className="meta">
              <div>
                <figure className="author-avatar dull">
                  <i className="manicon manicon-person"></i>
                </figure>
                <h4 className="author-name">
                  Lucas Thurston
                  <span className="reply-to">
                    <i className="manicon manicon-arrow-curved-right"></i>
                    Reply to Zach Davis
                  </span>
                </h4>
                <datetime>
                  1 day ago
                </datetime>
              </div>
            </section>
            <section className="body">
              {'Praesent commodo cursus magna, vel scelerisque nisl consectetur et.'}
            </section>
            <nav className="utility">
              <ul>
                <li>
                  <button>{'Reply'}</button>
                </li>
                <li>
                  <Utility.ShareBar url="#"/>
                </li>
                <li>
                  <button>{'Flag'}</button>
                </li>
              </ul>
            </nav>
          </li>
        </ul>
      </div>
    );
  }
}


export default connect(
  CommentThread.mapStateToProps
)(CommentThread);

