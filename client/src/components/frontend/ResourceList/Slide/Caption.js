import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class ResourceSlideCaption extends Component {
  static propTypes = {
    resource: PropTypes.object
  };

  render() {
    const resource = this.props.resource;
    const attr = resource.attributes;

    return (
      <div className="slide-caption">
        <header>
          <h2 className="resource-title">
            {attr.title}
          </h2>
        </header>
        <div className="resource-description">
          <p>
            {attr.description}
          </p>
        </div>
        <div className="resource-utility">
          <div className="bg-neutral90">
            <button className="more-link">
              {'Read More'}
            </button>
            <a href={attr.attachmentUrl} className="download-link">
              {'Download'} <i className="manicon manicon-arrow-down"></i>
            </a>
          </div>
        </div>
      </div>
    );
  }
}
