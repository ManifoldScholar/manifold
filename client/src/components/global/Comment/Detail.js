import React, { PureComponent, PropTypes } from 'react';
import { Utility } from 'components/frontend';
import { Comment as CommentContainer } from 'containers/global';
import { Link } from 'react-router';
import classNames from 'classnames';
import { FormattedDate } from 'components/global';

export default class CommentDetail extends PureComponent {

  static displayName = "Comment.Detail";

  static propTypes = {
    subject: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      replying: false
    };

    this.openReplyEditor = this.openReplyEditor.bind(this);
    this.closeReplyEditor = this.closeReplyEditor.bind(this);
  }

  openReplyEditor() {
    this.setState({
      replying: true
    });
  }

  closeReplyEditor() {
    this.setState({
      replying: false
    });
  }

  render() {
    const replyButtonClass = classNames({
      active: this.state.replying
    });
    const { comment } = this.props;
    const { creator } = comment.relationships;

    return (
      <li className="annotation-comment">
        <section className="meta">
          <div>
            <figure className="author-avatar dull">
              { creator.attributes.avatarStyles.smallSquare ?
                <img src={creator.attributes.avatarStyles.smallSquare} /> :
                <div className="no-image">
                  <i className="manicon manicon-person"></i>
                </div>
              }
            </figure>
            <h4 className="author-name">
              {creator.attributes.fullName}
              <span className="reply-to">
                  <i className="manicon manicon-arrow-curved-right"></i>
                  Reply to Me
                </span>
            </h4>
            <datetime>
              <FormattedDate
                format="distanceInWords"
                date={comment.attributes.createdAt}
              /> ago
            </datetime>
          </div>
        </section>
        <section className="body">
          {comment.attributes.body}
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
              <Utility.ShareBar url="#"/>
            </li>
            <li>
              <button>{'Flag'}</button>
            </li>
          </ul>
          {this.state.replying ?
            <CommentContainer.Editor
              subject={this.props.subject}
              parentId={comment.id}
              cancel={this.closeReplyEditor}
            />
            : null
          }
        </nav>
        <CommentContainer.Thread
          subject={this.props.subject}
          parentId={comment.id}
        />
      </li>
    );
  }

}
