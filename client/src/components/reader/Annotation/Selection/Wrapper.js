import React, { PureComponent, PropTypes } from 'react';
import Selection from '../Selection';

export default class AnnotationSelectionWrapper extends PureComponent {

  static displayName = "Annotation.Selection.Wrapper";

  static propTypes = {
    annotation: PropTypes.object,
    selection: PropTypes.object,
    annotating: PropTypes.bool,
    closeDrawer: PropTypes.func,
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
    const annotation = this.props.annotation;
    if (this.props.truncate && annotation.subject.length > this.props.truncate) {
      return (
        <Selection.Truncated
          selection={this.props.annotation.subject}
          truncate={this.props.truncate}
        />
      );
    }

    return this.props.annotation.subject;
  }

  render() {
    const cancelFunction = this.props.closeDrawer ?
        this.props.closeDrawer : this.handleCloseEditor;

    return (
      <div className="annotation-selection">
        <div className="selection-text">
          <i className="manicon manicon-quote"></i>
          {this.maybeTruncateSelection()}
        </div>
        { this.state.editorOpen ?
          <Selection.Editor cancel={cancelFunction} /> :
            <button className="annotate-button" onClick={this.handleOpenEditor}>
              Annotate
            </button>
        }
      </div>
    );
  }

}
