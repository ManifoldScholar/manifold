import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';
import { Helper } from 'components/global';
import { FormattedDate } from 'components/global';
import { Utility } from 'components/frontend';
import Annotation from 'components/reader/Annotation';
import { Comment } from 'containers/global';
import classNames from 'classnames';

export default class AnnotationCommentDetail extends PureComponent {

  static displayName = "Annotation.Comment.Detail";

  static propTypes = {
    creator: PropTypes.object.isRequired,
    annotation: PropTypes.object.isRequired
  }

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

    const creator = this.props.creator;
    const annotation = this.props.annotation;

    return (
      <li className="annotation-annotation">
        <section className="meta">
          {/* NB: Empty div required for flex-positioning of private/author marker */}
          <div>
            <figure className="author-avatar">
              { creator.attributes.avatarStyles.smallSquare ?
                <img src={creator.attributes.avatarStyles.smallSquare} /> :
                <div className="no-image">
                  <i className="manicon manicon-person"></i>
                </div>
              }
            </figure>
            <h4 className="author-name">
              {creator.attributes.fullName}
            </h4>
            <datetime>
              <FormattedDate
                  format="distanceInWords"
                  date={annotation.attributes.createdAt}
              /> ago
            </datetime>
          </div>
          { annotation.attributes.private ?
            <div className="marker secondary">
              {'Private'}
            </div>
            : null
          }
        </section>
        <section className="body">
          <Helper.SimpleFormat text={annotation.attributes.body} />
        </section>
        <nav className="utility">
          <ul>
            <li>
              <button
                className={replyButtonClass}
                onClick={this.openReplyEditor}
              >
                {'Reply'}
              </button>
            </li>
            <li>
              <button>{'Edit'}</button>
            </li>
            <li>
              <Utility.ShareBar url="#"/>
            </li>
            <li>
              <button>{'Delete'}</button>
            </li>
          </ul>
          {this.state.replying ?
            <Annotation.Comment.Editor cancel={this.closeReplyEditor} /> : null
          }
        </nav>
        <Comment.Thread topic={annotation} />
      </li>
    );
  }

}
