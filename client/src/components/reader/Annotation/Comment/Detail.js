import React, { PureComponent, PropTypes } from 'react';
import { Utility } from 'components/frontend';
import Editor from './Editor';
import { Link } from 'react-router';
import classNames from 'classnames';

export default class AnnotationCommentDetail extends PureComponent {

  static displayName = "Annotation.Comment.Detail";

  constructor(props) {
    super(props);

    this.state = {
      replying: false
    }

    this.openReplyEditor = this.openReplyEditor.bind(this);
    this.closeReplyEditor = this.closeReplyEditor.bind(this)
  }

  openReplyEditor() {
    this.setState({
      replying: true
    })
  }

  closeReplyEditor() {
    this.setState({
      replying: false
    })
  }

  render() {
    const replyButtonClass = classNames({
      active: this.state.replying
    });

    return (
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
              <button
                className="replyButtonClass"
                onClick={this.openReplyEditor}
              >
                {'Reply'}
              </button>
            </li>
            <li>
              <Utility.ShareBar url="#"/>
            </li>
            <li>
              <button>{'Flag'}</button>
            </li>
          </ul>
          {this.state.replying ? <Editor cancel={this.closeReplyEditor} /> : null}
        </nav>
        {/*
         NB: Nested comment thread would go here with the exact
         same markup as this one, starting with
         <div className="annotation-comment-thread">
         */}
      </li>
    );
  }

}
