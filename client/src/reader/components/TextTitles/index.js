import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Collecting from "frontend/components/collecting";

export default class TextTitles extends Component {
  static propTypes = {
    text: PropTypes.object.isRequired,
    section: PropTypes.object.isRequired,
    showSection: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      showSection: true
    };
  }

  get text() {
    return this.props.text;
  }

  get textTitle() {
    return this.text.attributes.titleFormatted;
  }

  get section() {
    return this.props.section;
  }

  get sectionTitle() {
    return this.section.attributes.name;
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

  handleTitleClick = eventIgnored => {
    this.toggleTitles();
  };

  render() {
    const titleClass = classNames({
      "reader-header__title-bar": true,
      "reader-header__title-bar--show-section":
        this.props.showSection && this.state.showSection
    });

    return (
      /* eslint-disable jsx-a11y/no-static-element-interactions */
      <div className={titleClass} onClick={this.handleTitleClick}>
        <h1 className="screen-reader-text">
          {`${this.textTitle}: ${this.sectionTitle}`}
        </h1>
        <div className="reader-header__title-bar-inner">
          <div className="reader-header__title-bar-text" aria-hidden="true">
            <span
              className="reader-header__title-inner-text"
              dangerouslySetInnerHTML={{ __html: this.textTitle }}
            />
            <span className="reader-header__title-bar-collecting-toggle">
              <Collecting.Toggle collectable={this.text} />
            </span>
          </div>
          <div className="reader-header__title-bar-text" aria-hidden="true">
            <span className="reader-header__title-inner-text">
              {this.sectionTitle}
            </span>
            <span className="reader-header__title-bar-collecting-toggle">
              <Collecting.Toggle collectable={this.section} />
            </span>
          </div>
        </div>
      </div>
      /* eslint-enable jsx-a11y/no-static-element-interactions */
    );
  }
}
