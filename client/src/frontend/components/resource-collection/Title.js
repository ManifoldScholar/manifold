import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import FormattedDate from "global/components/FormattedDate";
import Utility from "global/components/utility";

export default class ResourceCollectionTitle extends Component {
  static displayName = "ResourceCollection.Title";

  static propTypes = {
    resourceCollection: PropTypes.object,
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
    const attr = this.props.resourceCollection.attributes;

    return (
      <header
        className={classNames(
          "entity-section-wrapper__heading",
          "entity-section-wrapper__heading--wide",
          "collection-detail__heading",
          "section-heading"
        )}
      >
        <div className="main">
          <Utility.IconComposer size={54} icon="resourceCollection64" />
          <div className="body">
            <h1 className="title">{attr.title}</h1>
            {this.renderDate(attr)}
          </div>
        </div>
      </header>
    );
  }
}
