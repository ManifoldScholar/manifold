import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Helper from "global/components/helper";
import Utility from "frontend/components/utility";
import Editor from "./Editor";
import Meta from "./Meta";
import CommentContainer from "global/containers/comment";
import classNames from "classnames";
import { annotationsAPI, requests } from "api";
import { entityStoreActions } from "actions";

import Authorize from "hoc/authorize";

const { request } = entityStoreActions;

class AnnotationDetail extends PureComponent {
  static displayName = "Annotation.Detail";

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    annotation: PropTypes.object.isRequired,
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
  }

  startReply = () => {
    this.setState({
      action: "replying"
    });
  };

  startEdit = () => {
    this.setState({
      action: "editing"
    });
  };

  stopAction = () => {
    this.setState({
      action: null
    });
  };

  saveAnnotation = annotation => {
    const call = annotationsAPI.update(annotation.id, annotation.attributes);
    const res = this.props.dispatch(request(call, requests.rAnnotationUpdate));
    return res.promise;
  };

  deleteAnnotation = () => {
    const { annotation } = this.props;
    const call = annotationsAPI.destroy(annotation.id);
    const options = { removes: { type: "annotations", id: annotation.id } };
    const res = this.props.dispatch(
      request(call, requests.rAnnotationDestroy, options)
    );
    return res.promise;
  };

  render() {
    const { annotation } = this.props;
    if (!annotation) return null;

    const replyButtonClass = classNames({
      active: this.state.action === "replying"
    });
    const editButtonClass = classNames({
      active: this.state.action === "editing"
    });

    const creator = this.props.annotation.relationships.creator;

    return (
      <li className="annotation-annotation">
        <Meta annotation={annotation} creator={creator} />
        {this.state.action === "editing" ? (
          <Editor
            annotation={annotation}
            saveAnnotation={this.saveAnnotation}
            cancel={this.stopAction}
          />
        ) : (
          <div>
            <section className="body">
              <Helper.SimpleFormat text={annotation.attributes.body} />
            </section>
            <Authorize kind={"any"}>
              <nav className="utility">
                <ul>
                  {this.props.includeComments ? (
                    <li>
                      <button
                        className={replyButtonClass}
                        onClick={this.startReply}
                      >
                        {"Reply"}
                      </button>
                    </li>
                  ) : null}
                  <Authorize entity={annotation} ability={"update"}>
                    <li>
                      <button
                        className={editButtonClass}
                        onClick={this.startEdit}
                      >
                        {"Edit"}
                      </button>
                    </li>
                  </Authorize>
                  <Authorize entity={annotation} ability={"delete"}>
                    <li>
                      <Utility.ConfirmableButton
                        label="Delete"
                        confirmHandler={this.deleteAnnotation}
                      />
                    </li>
                  </Authorize>
                </ul>
                {this.state.action === "replying" ? (
                  <CommentContainer.Editor
                    subject={annotation}
                    cancel={this.stopAction}
                  />
                ) : null}
              </nav>
            </Authorize>
            {this.props.showLogin && (
              <Authorize kind="unauthenticated">
                <nav className="utility">
                  <ul>
                    <li>
                      <button onClick={this.props.showLogin}>
                        {"Login to reply"}
                      </button>
                    </li>
                  </ul>
                </nav>
              </Authorize>
            )}
          </div>
        )}
        {this.props.includeComments ? (
          <CommentContainer.Thread subject={annotation} />
        ) : null}
      </li>
    );
  }
}

export default connect()(AnnotationDetail);
