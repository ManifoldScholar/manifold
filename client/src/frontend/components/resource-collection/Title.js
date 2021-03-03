import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import FormattedDate from "global/components/FormattedDate";
import Utility from "global/components/utility";
import Collecting from "frontend/components/collecting";

export default class ResourceCollectionTitle extends Component {
  static displayName = "ResourceCollection.Title";

  static propTypes = {
    resourceCollection: PropTypes.object,
    showCreatedAt: PropTypes.bool
  };

  static defaultProps = {
    showCreatedAt: true
  };

  get collection() {
    return this.props.resourceCollection;
  }

  get attributes() {
    return this.collection.attributes;
  }

  get title() {
    return this.attributes.title;
  }

  get createdAt() {
    return this.attributes.createdAt;
  }

  get showCreatedAt() {
    return this.props.showCreatedAt;
  }

  render() {
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
            <div className="collection-detail__title-and-toggle">
              <h1
                className="title"
                dangerouslySetInnerHTML={{ __html: this.title }}
              />
              <span className="collection-detail__collecting-toggle">
                <Collecting.Toggle collectable={this.collection} />
              </span>
            </div>
            {this.showCreatedAt && (
              <span className="date">
                <FormattedDate
                  prefix="Collection created"
                  format="MMMM, yyyy"
                  date={this.createdAt}
                />
              </span>
            )}
          </div>
        </div>
      </header>
    );
  }
}
