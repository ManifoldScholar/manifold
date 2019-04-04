import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ResourceCollection from "frontend/components/resource-collection";
import ResourceList from "frontend/components/resource-list";
import lh from "helpers/linkHandler";
import isEmpty from "lodash/isEmpty";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";

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
          <nav className="button-nav button-nav--stack">
            <br />
            <Link
              to={collectionUrl}
              className={classNames(
                "button-secondary",
                "button-secondary--outlined"
              )}
            >
              <span className="button-secondary__text">
                Visit Collection Page
              </span>
              <IconComposer
                icon="arrowRight16"
                size="default"
                iconClass="button-secondary__icon"
              />
            </Link>
            <br />
            <button
              onClick={this.props.handleClose}
              className={classNames(
                "button-secondary",
                "button-secondary--outlined",
                "button-secondary--dull"
              )}
              data-id="close-overlay"
            >
              <IconComposer
                icon="arrowLeft16"
                size="default"
                iconClass="button-secondary__icon"
              />
              <span className="button-secondary__text">Return to Reader</span>
            </button>
          </nav>
        </div>
      </div>
    );
  }
}
