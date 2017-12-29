import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Helper } from "components/global";
import { FormattedDate } from "components/global";
import { Utility } from "components/frontend";
import Editor from "./Editor";
import { Comment as CommentContainer } from "containers/global";
import classNames from "classnames";
import HigherOrder from "containers/global/HigherOrder";

export default class AnnotationDetail extends PureComponent {
  static displayName = "Annotation.Detail";

  static propTypes = {
    creator: PropTypes.object.isRequired,
    annotation: PropTypes.object.isRequired,
    saveHandler: PropTypes.func,
    deleteHandler: PropTypes.func,
    showLogin: PropTypes.func,
    includeComments: PropTypes.bool.isRequired
  };

  static defaultProps = {
    includeComments: true
  };

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

  handleDelete = event => {
    if (event) event.preventDefault();
    this.props.deleteHandler(this.props.annotation);
  };

  render() {
    const replyButtonClass = classNames({
      active: this.state.action === "replying"
    });
    const editButtonClass = classNames({
      active: this.state.action === "editing"
    });

    const creator = this.props.creator;
    const annotation = this.props.annotation;

    const avatarClass = classNames({
      "author-avatar": true,
      dull: !creator.attributes.isCurrentUser
    });

    return (
      <li className="annotation-annotation">
        <section className="meta">
          {/* NB: Empty div required for flex-positioning of private/author marker */}
          <div>
            <figure className={avatarClass}>
              {creator.attributes.avatarStyles.smallSquare
                ? <div
                    className="image"
                    style={{
                      backgroundImage: `url(${creator.attributes.avatarStyles
                        .smallSquare})`
                    }}
                  >
                    <span className="screen-reader-text">
                      Profile image for {creator.attributes.fullName}
                    </span>
                  </div>
                : <div className="no-image">
                    <i className="manicon manicon-person" />
                  </div>}
            </figure>
            <h4 className="author-name">
              {creator.attributes.fullName}
            </h4>
            <datetime>
              <FormattedDate
                format="distanceInWords"
                date={annotation.attributes.createdAt}
              />{" "}
              ago
            </datetime>
          </div>
          {annotation.attributes.private
            ? <div className="marker secondary">
                {"Private"}
              </div>
            : null}
        </section>

        {this.state.action === "editing"
          ? <Editor
              id={annotation.id}
              body={annotation.attributes.body}
              private={annotation.attributes.private}
              subject={annotation.attributes.subject}
              startNode={annotation.attributes.startNode}
              startChar={annotation.attributes.startChar}
              endNode={annotation.attributes.endNode}
              endChar={annotation.attributes.endChar}
              saveHandler={this.props.saveHandler}
              cancel={this.stopAction}
            />
          : <div>
              <section className="body">
                <Helper.SimpleFormat text={annotation.attributes.body} />
              </section>
              <HigherOrder.RequireRole requiredRole="any">
                <nav className="utility">
                  <ul>
                    {this.props.includeComments
                      ? <li>
                          <button
                            className={replyButtonClass}
                            onClick={this.startReply}
                          >
                            {"Reply"}
                          </button>
                        </li>
                      : null}
                    {this.props.saveHandler &&
                    annotation.attributes.canUpdateObject
                      ? <li>
                          <button
                            className={editButtonClass}
                            onClick={this.startEdit}
                          >
                            {"Edit"}
                          </button>
                        </li>
                      : null}
                    {this.props.deleteHandler &&
                    annotation.attributes.canDeleteObject
                      ? <li>
                        <Utility.ConfirmableButton
                          label="Delete"
                          confirmHandler={this.handleDelete}
                        />
                        </li>
                      : null}
                  </ul>
                  {this.state.action === "replying"
                    ? <CommentContainer.Editor
                        subject={annotation}
                        cancel={this.stopAction}
                      />
                    : null}
                </nav>
              </HigherOrder.RequireRole>
              <HigherOrder.RequireRole requiredRole="none">
                <nav className="utility">
                  <ul>
                    <li>
                      <button onClick={this.props.showLogin}>
                        {"Login to reply"}
                      </button>
                    </li>
                  </ul>
                </nav>
              </HigherOrder.RequireRole>
            </div>}
        {this.props.includeComments
          ? <CommentContainer.Thread subject={annotation} />
          : null}
      </li>
    );
  }
}

//
