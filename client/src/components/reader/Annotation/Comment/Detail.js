import React, { PureComponent, PropTypes } from 'react';
import { Utility } from 'components/frontend';
import { Link } from 'react-router';
import classNames from 'classnames';

export default class AnnotationCommentDetail extends PureComponent {

  static displayName = "Annotation.Comment.Detail";

  render() {
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
    );
  }

}
