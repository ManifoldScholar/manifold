import React, { PureComponent, PropTypes } from 'react';

export default class ResourceViewerThumbnail extends PureComponent {

  static displayName = "ResourceViewer.Thumbnail";

  static propTypes = {
    resource: PropTypes.object,
    location: PropTypes.number,
    overlap: PropTypes.boolean
  };

  render() {
    const attr = this.props.resource.attributes;

    return (
      <li
        className="resource-preview-single"
        style={{
          top: this.props.location + 'px',
          border: this.props.overlap ? '5px green solid' : 0
        }}
      >
        <figure>
          <img/>
          <figcaption>
            {attr.title}
          </figcaption>
        </figure>
      </li>
    );
  }
}
