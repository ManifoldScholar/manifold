import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import get from 'lodash/get';
import Icon from './Icon';

export default class ResourceThumbnail extends Component {

  static displayName = "Resource.Thumbnail";

  static propTypes = {
    projectId: PropTypes.string,
    resource: PropTypes.object,
    isList: PropTypes.bool,
    showKind: PropTypes.bool,
    showTitle: PropTypes.bool,
    variant: PropTypes.string,
    noCrop: PropTypes.bool,
    additionalClasses: PropTypes.string,
  };

  static defaultProps = {
    showKind: true,
    showTitle: false,
    variant: "smallPortrait",
    additionalClasses: ""
  };

  constructor() {
    super();
    this.icons = {
      audio: Icon.Audio,
      document: Icon.Document,
      file: Icon.File,
      image: Icon.Image,
      interactive: Icon.Interactive,
      link: Icon.Link,
      pdf: Icon.Pdf,
      presentation: Icon.Presentation,
      spreadsheet: Icon.Spreadsheet,
      video: Icon.Video
    };
  }

  getResourceKind(kind) {
    if (!kind) return "file";
    return kind.toLowerCase().charAt(0).toUpperCase() + kind.slice(1);
  }

  getImage(resource) {
    return get(resource, `attributes.attachmentThumbnails.${this.props.variant}`);
  }

  hasImage(resource) {
    return !!this.getImage(resource);
  }

  render() {

    const { resource } = this.props;
    const hasImage = this.hasImage(resource);

    const wrapperClass = classNames({
      'resource-thumbnail': true,
      'bg-image': hasImage && !this.props.noCrop,
      title: this.props.showTitle
    });

    const backgroundImage = hasImage && !this.props.noCrop ? `url(${this.getImage(resource)})` : null;
    const ResourceIcon = this.icons[resource.attributes.kind];

    return (
      <div
        className={`${wrapperClass} ${this.props.additionalClasses}`}
        style={{ backgroundImage }}
      >
        <div className="wrapper">
          <figure className="resource-type">
            { this.props.showKind ?
              <figcaption>
                {this.getResourceKind(resource.attributes.kind)}
              </figcaption>
              : null }
            { this.props.noCrop ?
              <img className="resource-image" src={this.getImage(resource)}/> :
              <i className={`resource-icon + ${resource.attributes.kind}`}>
                {ResourceIcon ? <ResourceIcon/> : null}
              </i>
            }
          </figure>
          { this.props.showTitle ?
            <h4 className="resource-title">
              {resource.attributes.title}
            </h4>
          : null }
        </div>
      </div>

    );

  }
}
