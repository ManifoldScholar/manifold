import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ResourceCollection from "frontend/components/resource-collection";
import ResourceList from "frontend/components/resource-list";
import lh from "helpers/linkHandler";
import isEmpty from "lodash/isEmpty";

export default class ResourceCollectionDetail extends PureComponent {
  static propTypes = {
    resourceCollection: PropTypes.object,
    resourceCollectionUrl: PropTypes.string,
    slideshowResources: PropTypes.array,
    slideshowPagination: PropTypes.object,
    dispatch: PropTypes.func,
    handleClose: PropTypes.func
  };

  componentDidMount() {
    window.addEventListener("keyup", this.handleEscape);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleEscape);
  }

  handleEscape = event => {
    if (event.keyCode === 27) {
      this.props.handleClose(event);
    }
  };

  buildRedirectUrl(collection) {
    if (!collection) return null;
    return lh.link(
      "frontendProjectResourceCollection",
      collection.relationships.project.attributes.slug,
      collection.attributes.slug
    );
  }

  render() {
    const resourceCollection = this.props.resourceCollection;
    const attr = resourceCollection.attributes;
    const collectionUrl =
      this.props.resourceCollectionUrl ||
      this.buildRedirectUrl(resourceCollection);

    return (
      <div>
        <div className="collection-detail">
          <div className="container">
            <ResourceCollection.Title resourceCollection={resourceCollection} />
            {!isEmpty(attr.descriptionFormatted) ? (
              <div className="collection-description">
                <div
                  dangerouslySetInnerHTML={{
                    __html: attr.descriptionFormatted
                  }}
                />
              </div>
            ) : null}
          </div>
        </div>
        <ResourceList.Slideshow
          resourceCollection={resourceCollection}
          collectionResources={this.props.slideshowResources}
          dispatch={this.props.dispatch}
          pagination={this.props.slideshowPagination}
          slideOptions={{ enableZoom: false }}
        />
        <div className="container">
          <nav className="button-nav">
            <br />
            <Link to={collectionUrl} className="button-secondary outlined">
              Visit Collection Page
              <i className="manicon manicon-arrow-right" aria-hidden="true" />
            </Link>
            <br />
            <button
              onClick={this.props.handleClose}
              className="button-secondary outlined dull"
              data-id="close-overlay"
            >
              <i className="manicon manicon-arrow-left" aria-hidden="true" />
              Return to Reader
            </button>
          </nav>
        </div>
      </div>
    );
  }
}
