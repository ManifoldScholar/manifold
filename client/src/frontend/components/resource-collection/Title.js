import React, { Component } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import Utility from "global/components/utility";

export default class ResourceCollectionTitle extends Component {
  static defaultProps = {
    showCreatedAt: true
  };

  static displayName = "ResourceCollection.Title";

  static propTypes = {
    resourceCollection: PropTypes.object,
    showCreatedAt: PropTypes.bool
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
    const attr = this.props.resourceCollection.attributes;

    return (
      <header className="section-heading">
        <div className="main">
          <i className="manicon" aria-hidden="true">
            <Utility.IconComposer size={54} icon="resourceCollection64" />
          </i>
          <div className="body">
            <h2 className="title">{attr.title}</h2>
            {this.renderDate(attr)}
          </div>
        </div>
      </header>
    );
  }
}
