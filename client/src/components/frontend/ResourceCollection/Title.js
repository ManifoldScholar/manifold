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

  render() {
    const attr = this.props.collection.attributes;

    return (
      <header>
        <div className="collection-title">
          <div>
            <i className="manicon manicon-file-box" />
            <div>
              <h1>
                {attr.title}
              </h1>
              {this.props.showCreatedAt
                ? <span className="collection-date">
                    <FormattedDate
                      prefix="Collection created"
                      format="MMMM, YYYY"
                      date={attr.createdAt}
                    />
                  </span>
                : null}
            </div>
          </div>
        </div>
      </header>
    );
  }
}
