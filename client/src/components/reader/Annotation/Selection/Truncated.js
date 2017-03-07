import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames';

export default class AnnotationSelectionTruncated extends PureComponent {

  static displayName = "Annotation.Selection.Truncated";

  static propTypes = {
    selection: PropTypes.string,
    truncate: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      truncated: true
    };

    this.handleShowFull = this.handleShowFull.bind(this);
  }

  truncateSelection() {
    return this.props.selection.substring(0, this.props.truncate) + '...';
  }

  getPassage() {
    if (this.state.truncated) {
      return this.truncateSelection();
    }

    return this.props.selection;
  }

  handleShowFull() {
    this.setState({
      truncated: false
    });
  }

  render() {
    const truncatedWrapperClass = classNames({
      wrapper: true,
      blur: this.state.truncated
    });

    return (
      <div>
        <div className="selection-truncated">
          <div className={truncatedWrapperClass}>
            {this.getPassage()}
          </div>
          {this.state.truncated ?
            <button className="button-trim-primary trim-top" onClick={this.handleShowFull}>
              {'Read Full Passage'}
            </button> : null
          }
        </div>
      </div>
    );
  }

}
