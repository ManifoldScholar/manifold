import React, { PureComponent, PropTypes } from 'react';
import Selection from '../Selection';

export default class AnnotationSelectionWrapper extends PureComponent {

  static displayName = "Annotation.Selection.Wrapper";

  static propTypes = {
    subject: PropTypes.string,
    startNode: PropTypes.string,
    startChar: PropTypes.number,
    endNode: PropTypes.string,
    endChar: PropTypes.number,
    annotating: PropTypes.bool,
    closeDrawer: PropTypes.func,
    createHandler: PropTypes.func,
    truncate: PropTypes.number
  }

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
    if (this.props.truncate && this.props.subject.length > this.props.truncate) {
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
    const cancelFunction = this.props.closeDrawer ?
        this.props.closeDrawer : this.handleCloseEditor;

    return (
      <div className="annotation-selection">
        <div className="selection-text">
          <div className="container">
            <i className="manicon manicon-quote"></i>
            {this.maybeTruncateSelection()}
          </div>
          { this.state.editorOpen ? null :
            <button className="annotate-button" onClick={this.handleOpenEditor}>
              Annotate
            </button>
          }
        </div>
        { this.state.editorOpen ?
          <Selection.Editor {...this.props} cancel={cancelFunction} /> : null
        }
      </div>
    );
  }

}
