import React, { Component } from "react";
import PropTypes from "prop-types";
import { annotationsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import lh from "helpers/linkHandler";
import { Annotation } from "components/reader";
import { Comment } from "containers/global";
import { Link } from "react-router-dom";

const { request } = entityStoreActions;

export default class MyAnnotationsDetailComponent extends Component {
  static propTypes = {
    annotation: PropTypes.object,
    dispatch: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      editorOpen: false,
      threadOpen: false
    };

    this.handleOpenEditor = this.handleOpenEditor.bind(this);
    this.handleOpenThread = this.handleOpenThread.bind(this);
    this.handleCloseEditor = this.handleCloseEditor.bind(this);
    this.handleCloseThread = this.handleCloseThread.bind(this);
    this.updateAnnotation = this.updateAnnotation.bind(this);
  }

  handleOpenEditor() {
    this.setState({
      editorOpen: true
    });
  }

  handleCloseEditor() {
    this.setState({
      editorOpen: false
    });
  }

  handleOpenThread() {
    this.setState({
      threadOpen: true
    });
  }

  handleCloseThread() {
    this.setState({
      threadOpen: false
    });
  }

  updateAnnotation(annotation) {
    const call = annotationsAPI.update(annotation.id, annotation);
    const res = this.props.dispatch(request(call, requests.rAnnotationUpdate));
    return res.promise;
  }

  renderEditButton() {
    if (this.state.editorOpen) return null;
    return (
      <li>
        <button className="annotate-button" onClick={this.handleOpenEditor}>
          Edit
        </button>
      </li>
    );
  }

  renderThreadButton() {
    return (
      <li>
        {this.state.threadOpen
          ? <button
              className="annotate-button"
              onClick={this.handleCloseThread}
            >
              Hide Replies
            </button>
          : <button className="annotate-button" onClick={this.handleOpenThread}>
              View Replies
            </button>}
      </li>
    );
  }

  render() {
    if (!this.props.annotation) return null;
    const annotation = this.props.annotation;
    return (
      <div className="annotation-selection">
        <div className="selection-text">
          <div className="container">
            <i className="manicon manicon-quote" />
            {annotation.attributes.subject}
          </div>
        </div>
        <div className="annotation-list">
          <div className="annotation-annotation">
            {this.state.editorOpen
              ? null
              : <div className="body">
                  {annotation.attributes.body}
                </div>}
            <nav className="utility">
              <ul>
                {this.renderEditButton()}
                {annotation.attributes.commentsCount
                  ? this.renderThreadButton()
                  : null}
                <li>
                  <Link
                    to={lh.link(
                      "readerSection",
                      annotation.attributes.textId,
                      annotation.attributes.textSectionId,
                      `#annotation-${annotation.id}`
                    )}
                  >
                    View in Text
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          {this.state.editorOpen
            ? <Annotation.Editor
                {...annotation.attributes}
                id={annotation.id}
                cancel={this.handleCloseEditor}
                saveHandler={this.updateAnnotation}
              />
            : null}
          {this.state.threadOpen
            ? <Comment.Thread subject={annotation} />
            : null}
        </div>
      </div>
    );
  }
}
