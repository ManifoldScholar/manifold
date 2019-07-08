import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class TextTitles extends Component {
  static propTypes = {
    textTitle: PropTypes.string,
    sectionTitle: PropTypes.string,
    showSection: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      showSection: true
    };
  }

  toggleTitles() {
    // Only toggle the title back showSection is coming from scrollAware
    if (this.props.showSection && this.state.showSection) {
      this.setState({
        showSection: false
      });

      setTimeout(() => {
        this.setState({
          showSection: true
        });
      }, 2500);
    }
  }

  handleTitleClick = () => {
    // Not using event, but handler stub will allow it if it becomes necessary
    this.toggleTitles();
  };

  render() {
    const titleClass = classNames({
      title: true,
      "show-section": this.props.showSection && this.state.showSection
    });

    return (
      /* eslint-disable jsx-a11y/no-static-element-interactions */
      <div className={titleClass} onClick={this.handleTitleClick}>
        <h1 className="screen-reader-text">
          {`${this.props.textTitle}: ${this.props.sectionTitle}`}
        </h1>
        <h1
          className="text-title"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: this.props.textTitle }}
        />
        <h1 className="section-title" aria-hidden="true">
          {this.props.sectionTitle}
        </h1>
      </div>
      /* eslint-enable jsx-a11y/no-static-element-interactions */
    );
  }
}
