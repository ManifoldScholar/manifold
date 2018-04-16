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
      <header className={titleClass} onClick={this.handleTitleClick}>
        <h3 className="text-title">{this.props.textTitle}</h3>
        <h2 className="section-title">{this.props.sectionTitle}</h2>
      </header>
    );
  }
}
