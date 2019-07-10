import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import nl2br from "nl2br";

export default class AnnotationSelectionTruncated extends PureComponent {

  static displayName = "Annotation.Annotation.TextContentTruncated";

  static propTypes = {
    selection: PropTypes.string,
    truncate: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      truncated: true
    };
  }

  componentDidMount() {
    this.wrapper.style.height = this.content.offsetHeight + "px";
  }

  getPassage() {
    let text = this.props.selection;
    if (this.state.truncated) {
      text = this.truncateSelection();
    }
    return <div dangerouslySetInnerHTML={{ __html: nl2br(text) }} />;
  }

  truncateSelection() {
    return this.props.selection.substring(0, this.props.truncate) + "...";
  }

  handleShowFull = () => {
    this.setState({
      truncated: false
    });

    setTimeout(() => {
      this.wrapper.style.height = this.content.offsetHeight + "px";
    }, 50);
  };

  get truncatedWrapperClassNames() {
    return classNames({
     "annotation-selection__truncated-wrapper": true,
     "annotation-selection__truncated-wrapper--blur": this.state.truncated
   });
  }

  get showFullButtonClassNames() {
    return classNames({
      "annotation-selection__expand-button": true,
      "annotation-selection__expand-button--hidden": !this.state.truncated,
    });
  }

  render() {

    return (
        <React.Fragment>
          <div
            className={this.truncatedWrapperClassNames}
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
            className={this.showFullButtonClassNames}
            onClick={this.handleShowFull}
          >
            {"Read Full Passage"}
          </button>
        </React.Fragment>
    );
  }
}
