import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';
import { Helper } from 'components/global';
import { FormattedDate } from 'components/global';
import { Utility } from 'components/frontend';
import { Comment } from 'components/global';
import Editor from './Editor';
import { Comment as CommentContainer } from 'containers/global';
import classNames from 'classnames';

export default class AnnotationDetail extends PureComponent {

  static displayName = "Annotation.Detail";

  static propTypes = {
    creator: PropTypes.object.isRequired,
    annotation: PropTypes.object.isRequired,
    saveHandler: PropTypes.func,
    deleteHandler: PropTypes.func
  }

  constructor(props) {
    super(props);

    this.state = {
      action: null
    };

    this.startReply = this.startReply.bind(this);
    this.startEdit = this.startEdit.bind(this);
    this.stopAction = this.stopAction.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  startReply() {
    this.setState({
      action: "replying"
    });
  }

  startEdit() {
    this.setState({
      action: "editing"
    });
  }

  stopAction() {
    this.setState({
      action: null
    });
  }

  handleDelete(event) {
    event.preventDefault();
    this.props.deleteHandler(this.props.annotation);
  }

  render() {
    const replyButtonClass = classNames({
      active: this.state.action === "replying"
    });
    const editButtonClass = classNames({
      active: this.state.action === "editing"
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

        {this.state.action === "editing" ?
          <Editor
            id={annotation.id}
            body={annotation.attributes.body}
            isPrivate={annotation.attributes.isPrivate}
            subject={annotation.attributes.subject}
            startNode={annotation.attributes.startNode}
            startChar={annotation.attributes.startChar}
            endNode={annotation.attributes.endNode}
            endChar={annotation.attributes.endChar}
            saveHandler={this.props.saveHandler}
            cancel={this.stopAction}
          />
        :
          <div>
            <section className="body">
              <Helper.SimpleFormat text={annotation.attributes.body} />
            </section>
            <nav className="utility">
              <ul>
                <li>
                  <button
                    className={replyButtonClass}
                    onClick={this.startReply}
                  >
                    {'Reply'}
                  </button>
                </li>
                {this.props.saveHandler ?
                  <li>
                    <button
                      className={editButtonClass}
                      onClick={this.startEdit}
                    >
                      {'Edit'}
                    </button>
                  </li>
                : null}
                {this.props.deleteHandler ?
                  <li>
                    <button
                      onClick={this.handleDelete}
                    >
                      {'Delete'}
                    </button>
                  </li>
                : null}
              </ul>
              {this.state.action === "replying" ?
                <CommentContainer.Editor
                  subject={annotation}
                  cancel={this.stopAction}
                />
                : null
              }

            </nav>
          </div>
        }
        <CommentContainer.Thread subject={annotation} />
      </li>
    );
  }

}
