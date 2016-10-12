import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class ResourceSlideCaption extends Component {
  static propTypes = {
    resource: PropTypes.object
  };

  render() {
    const resource = this.props.resource;

    return (
      <div className="slide-caption">
        <header>
          <h2 className="resource-title">
            {resource.title}
          </h2>
        </header>
        <div className="resource-description">
          <p>
            {resource.description}
          </p>
        </div>
        <div className="resource-utility">
          <div className="bg-neutral90">
            <button className="more-link">
              {'Read More'}
            </button>
            <Link to={resource.link} className="download-link">
              {'Download'} <i className="manicon manicon-arrow-down"></i>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
