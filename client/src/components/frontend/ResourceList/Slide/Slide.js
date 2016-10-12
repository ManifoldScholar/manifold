import React, { Component, PropTypes } from 'react';

export default class ResourceSlideFigure extends Component {
  static propTypes = {
    resource: PropTypes.object
  };

  componentDidMount() {
    const parentWidth = this._figure.parentNode.offsetWidth;
    this._figure.style.width = parentWidth + 'px';
  }

  render() {
    const resource = this.props.resource;

    return (
      <figure>
        <div
          ref={ (c) => {
            this._figure = c;
          } }
          className="figure-default"
          style={ { backgroundImage: 'url(/static/images/resource-splash.png)' } }
        >
          <div className="resource-info">
            <i className={`manicon manicon-resource-${resource.attributes.type}`}></i>
            <span className="resource-type">
              {resource.attributes.type}
            </span>
            <span className="resource-date">
              {'Uploaded January 2017'}
            </span>
          </div>
        </div>
      </figure>
    );
  }
}
