import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class Label extends PureComponent {
  static propTypes = {
    text: PropTypes.object.isRequired
  };

  isPublished() {
    return this.props.text.attributes.published;
  }

  category() {
    return this.props.text.relationships.category;
  }

  render() {
    if (this.isPublished()) return null;
    if (!this.category()) return null;

    return (
      <div className="section-category-label">
        <div className="container">
          <div className="label">
            {this.category().attributes.title}
          </div>
        </div>
      </div>
    );
  }
}
