import React, { Component } from "react";
import PropTypes from "prop-types";
import FormattedDate from "components/global/FormattedDate";

export default class ResourceCollectionTitle extends Component {
  static displayName = "ResourceCollection.Title";

  static propTypes = {
    collection: PropTypes.object,
    showCreatedAt: PropTypes.bool
  };

  static defaultProps = {
    showCreatedAt: true
  };

  renderDate(attributes) {
    if (!this.props.showCreatedAt) return null;
    return (
      <span className="date">
        <FormattedDate
          prefix="Collection created"
          format="MMMM, YYYY"
          date={attributes.createdAt}
        />
      </span>
    );
  }

  render() {
    const attr = this.props.collection.attributes;

    return (
      <header className="section-heading">
        <div className="main">
          <i className="manicon manicon-file-box" />
          <div className="body">
            <h2 className="title">{attr.title}</h2>
            {this.renderDate(attr)}
          </div>
        </div>
      </header>
    );
  }
}
