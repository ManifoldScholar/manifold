import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import throttle from "lodash/throttle";
import classNames from "classnames";

export default class Label extends PureComponent {
  static propTypes = {
    text: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.state = {
      fixed: true
    };
  }

  componentDidMount() {
    // Check if footer label is visible on scroll, and hide
    // fixed clone if it is
    this.throttledFixed = throttle(this.toggleFixed, 200).bind(this);
    window.addEventListener("scroll", this.throttledFixed);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.throttledFixed);
  }

  toggleFixed() {
    // Show or hide label depending on footer visibility
    const staticRect = this.staticLabel.getBoundingClientRect();
    this.setState({
      fixed: staticRect.bottom > window.innerHeight
    });
  }

  isPublished() {
    return this.props.text.attributes.published;
  }

  category() {
    return this.props.text.relationships.category;
  }

  render() {
    if (this.isPublished()) return null;
    if (!this.category()) return null;

    const hidden = !this.state.fixed;
    const fixedLabelClass = classNames("section-category-label", "fixed", {
      hidden
    });

    return (
      <div>
        <div className={fixedLabelClass}>
          <div className="container">
            <div className="label">
              {this.category().attributes.title}
            </div>
          </div>
        </div>
        <div
          className="section-category-label"
          ref={l => {
            this.staticLabel = l;
          }}
        >
          <div className="container">
            <div className="label">
              {this.category().attributes.title}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
