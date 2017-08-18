import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ResourceList, ResourceCollection } from "components/frontend";
import lh from "helpers/linkHandler";

export default class CollectionDetail extends PureComponent {
  static propTypes = {
    collection: PropTypes.object,
    collectionUrl: PropTypes.string,
    slideshowResources: PropTypes.array,
    slideshowPagination: PropTypes.object,
    dispatch: PropTypes.func,
    handleClose: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.handleEscape = this.handleEscape.bind(this);
  }

  componentDidMount() {
    window.addEventListener("keyup", this.handleEscape);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleEscape);
  }

  handleEscape(event) {
    if (event.keyCode === 27) {
      this.props.handleClose(event);
    }
  }

  buildRedirectUrl(collection) {
    if (!collection) return null;
    const pId = collection.relationships.project.id;
    return lh.link("frontendProjectCollection", pId, collection.id);
  }

  render() {
    const collection = this.props.collection;
    const attr = collection.attributes;
    const collectionUrl =
      this.props.collectionUrl || this.buildRedirectUrl(collection);

    return (
      <div className="collection-detail">
        <div className="container">
          <ResourceCollection.Title collection={collection} />
          <div className="collection-description">
            <p dangerouslySetInnerHTML={{ __html: attr.description }} />
          </div>
        </div>
        <ResourceList.Slideshow
          collectionId={collection.id}
          collectionResources={this.props.slideshowResources}
          dispatch={this.props.dispatch}
          pagination={this.props.slideshowPagination}
          hideDetailUrl
        />
        <div className="container">
          <nav className="button-nav">
            <br />
            <Link to={collectionUrl} className="button-secondary outlined">
              Visit Collection Page<i className="manicon manicon-arrow-right" />
            </Link>
            <br />
            <button
              onClick={this.props.handleClose}
              className="button-secondary outlined dull"
              data-id="close-overlay"
            >
              <i className="manicon manicon-arrow-left" />Return to Reader
            </button>
          </nav>
        </div>
      </div>
    );
  }
}
