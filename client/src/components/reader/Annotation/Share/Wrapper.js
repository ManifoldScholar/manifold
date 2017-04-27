import React, { PureComponent, PropTypes } from 'react';
import Share from './';
import Selection from '../Selection';

export default class AnnotationShareWrapper extends PureComponent {

  static displayName = "Annotation.Share.Wrapper";

  static propTypes = {
    subject: PropTypes.string,
    startNode: PropTypes.string,
    startChar: PropTypes.number,
    endNode: PropTypes.string,
    endChar: PropTypes.number,
    annotating: PropTypes.bool,
    closeDrawer: PropTypes.func,
    truncate: PropTypes.number,
    closeOnSave: PropTypes.bool,
    addsTo: PropTypes.string,
    showLogin: PropTypes.func
  }

  static defaultProps = {
    closeOnSave: true
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
        </div>
        { this.state.editorOpen ?
          <Share.Citation
            {...this.props}
            cancel={cancelFunction}
          /> : null
        }
      </div>
    );
  }

}
