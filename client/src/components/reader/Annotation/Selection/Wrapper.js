import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Editor from "../Editor";
import Selection from "../Selection";
import HigherOrder from "containers/global/HigherOrder";

export default class AnnotationSelectionWrapper extends PureComponent {
  static displayName = "Annotation.Selection.Wrapper";

  static propTypes = {
    subject: PropTypes.string,
    startNode: PropTypes.string,
    startChar: PropTypes.number,
    endNode: PropTypes.string,
    endChar: PropTypes.number,
    saveHandler: PropTypes.func,
    closeOnSave: PropTypes.bool,
    addsTo: PropTypes.string,
    annotating: PropTypes.bool,
    closeDrawer: PropTypes.func,
    truncate: PropTypes.number,
    showLogin: PropTypes.func,
    includeEditor: PropTypes.bool.isRequired
  };

  static defaultProps = {
    closeOnSave: true,
    includeEditor: true
  };

  constructor(props) {
    super(props);

    this.state = {
      editorOpen: this.props.annotating
    };

    this.handleOpenEditor = this.handleOpenEditor.bind(this);
    this.handleCloseEditor = this.handleCloseEditor.bind(this);
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

  maybeTruncateSelection() {
    if (
      this.props.truncate &&
      this.props.subject.length > this.props.truncate
    ) {
      return (
        <Selection.Truncated
          selection={this.props.subject}
          truncate={this.props.truncate}
        />
      );
    }

    return this.props.subject;
  }

  render() {
    const cancelFunction = this.props.closeDrawer
      ? this.props.closeDrawer
      : this.handleCloseEditor;

    return (
      <div className="annotation-selection">
        <div className="selection-text">
          <div className="container">
            <i className="manicon manicon-quote" />
            {this.maybeTruncateSelection()}
          </div>
          {this.props.includeEditor
            ? <HigherOrder.RequireRole requiredRole="any">
                {this.state.editorOpen
                  ? null
                  : <button
                      className="annotate-button"
                      onClick={this.handleOpenEditor}
                    >
                      Annotate
                    </button>}
              </HigherOrder.RequireRole>
            : null}
          {this.props.includeEditor
            ? <HigherOrder.RequireRole requiredRole="none">
                <button
                  className="annotate-button"
                  onClick={this.props.showLogin}
                >
                  {"Login to annotate"}
                </button>
              </HigherOrder.RequireRole>
            : null}
        </div>
        {this.state.editorOpen
          ? <Editor {...this.props} cancel={cancelFunction} />
          : null}
      </div>
    );
  }
}
