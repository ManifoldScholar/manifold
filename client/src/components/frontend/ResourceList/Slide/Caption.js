import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { VelocityComponent } from 'velocity-react';
import get from 'lodash/get';
import lh from 'helpers/linkHandler';

export default class ResourceSlideCaption extends Component {

  static propTypes = {
    resource: PropTypes.object,
    collectionId: PropTypes.string
  };

  constructor() {
    super();
    this.state = {
      init: true,
      expanded: false,
      targetHeight: '5em'
    };
    this.handleReadMore = this.handleReadMore.bind(this);
  }

  componentDidMount() {
    this.checkReadMoreVisibility();
  }

  componentDidUpdate() {
    this.checkReadMoreVisibility();
  }

  getFullDescriptionHeight() {
    if (!this._description) return;
    this._description.style.height = 'auto';
    const measuredHeight = this._description.offsetHeight;
    this._description.style.height = '5em';
    return measuredHeight + 'px';
  }

  handleReadMore() {
    if (!this.state.expanded) {
      this.setState({
        targetHeight: this.getFullDescriptionHeight()
      });
    }

    this.setState({
      expanded: !this.state.expanded
    });
  }

  createDescription(description) {
    if (!description) return { __html: 'No content provided.' };
    return {
      __html: description
    };
  }

  checkReadMoreVisibility() {
    if (!this._readMoreButton || !this._descriptionContents) return;
    const visibleHeight = 37;
    if (this._descriptionContents.offsetHeight < visibleHeight) {
      this._readMoreButton.classList.add("hidden");
    } else {
      this._readMoreButton.classList.remove("hidden");
    }
  }

  detailUrl() {
    const { resource } = this.props;
    const pid = resource.attributes.projectId;
    const cid = this.props.collectionId;
    if (cid) {
      const crs = get(resource, "relationships.collectionResources");
      const cr = crs.find((cmpr) => cmpr.attributes.collectionId === cid);
      if (cr) {
        const crid = cr.id;
        return lh.link("frontendProjectCollectionCollectionResource", pid, cid, crid);
      }
    }
    const rid = resource.id;
    return lh.link("frontendProjectResource", pid, rid);
  }

  render() {
    const resource = this.props.resource;
    const attr = resource.attributes;
    const moreLinkClass = classNames({
      'more-link': true,
      open: this.state.expanded
    });
    const detailUrl = this.detailUrl();

    // Animation to open description
    const animation = {
      animation: {
        height: this.state.expanded ? this.state.targetHeight : '5em'
      },
      duration: 250,
      complete: () => {
        if (this.state.expanded) {
          this._description.style.height = 'auto';
        }
      }
    };

    return (
      <div className="slide-caption">
        <header>
          <h2
            className="resource-title"
            dangerouslySetInnerHTML={{ __html: attr.titleFormatted }}
          />
        </header>
        <VelocityComponent {...animation}>
          <div className="resource-description" ref={ (e) => {
            this._description = e;
          } }>
            <div
              ref={ (e) => {
                this._descriptionContents = e;
              }}
              dangerouslySetInnerHTML={this.createDescription(attr.captionFormatted)}
            />
          </div>
        </VelocityComponent>
        <div className="resource-utility">
          <div className="bg-neutral90">
            <button
              className={moreLinkClass}
              onClick={this.handleReadMore}
              ref={ (e) => {
                this._readMoreButton = e;
              }}
            >
              <span className="open-text">
                {'Read More'}
              </span>
              <span className="close-text">
                {'Hide Description'}
              </span>
            </button>
            {attr.downloadable ?
              <Link
                to={attr.attachmentStyles.original}
                target="_blank"
                className="download-link"
              >
                {'Download'}
                <i className="manicon manicon-arrow-down"></i>
              </Link>
            : null}
            {detailUrl ?
              <Link
                className="detail-link"
                to={detailUrl}
              >
                {'Details'}
              </Link>
            : null}
          </div>
        </div>
      </div>
    );
  }
}
