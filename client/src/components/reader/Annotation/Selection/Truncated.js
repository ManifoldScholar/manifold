import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class AnnotationSelectionTruncated extends PureComponent {
  static displayName = "Annotation.Selection.Truncated";

  static propTypes = {
    selection: PropTypes.string,
    truncate: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      truncated: true
    };

    this.handleShowFull = this.handleShowFull.bind(this);
  }

  componentDidMount() {
    this.wrapper.style.height = this.content.offsetHeight + "px";
  }

  getPassage() {
    if (this.state.truncated) {
      return this.truncateSelection();
    }

    return this.props.selection;
  }

  truncateSelection() {
    return this.props.selection.substring(0, this.props.truncate) + "...";
  }

  handleShowFull() {
    this.setState({
      truncated: false
    });

    setTimeout(() => {
      this.wrapper.style.height = this.content.offsetHeight + "px";
    }, 50);
  }

  render() {
    const truncatedWrapperClass = classNames({
      wrapper: true,
      blur: this.state.truncated
    });

    const constShowFullButtonClass = classNames({
      "button-trim-primary": true,
      "trim-top": true,
      hidden: !this.state.truncated
    });

    return (
      <div>
        <div className="selection-truncated">
          <div
            className={truncatedWrapperClass}
            ref={wrapper => {
              this.wrapper = wrapper;
            }}
          >
            <div
              ref={content => {
                this.content = content;
              }}
            >
              {this.getPassage()}
            </div>
          </div>
          <button
            className={constShowFullButtonClass}
            onClick={this.handleShowFull}
          >
            {"Read Full Passage"}
          </button>
        </div>
      </div>
    );
  }
}
