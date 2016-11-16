import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import throttle from 'lodash/throttle';

export default class ResourceSlideFigure extends Component {
  static propTypes = {
    resource: PropTypes.object
  };

  constructor() {
    super();
    this.getParentWidth = this.getParentWidth.bind(this);
  }

  componentDidMount() {
    this._figure.style.width = this.getParentWidth(this._figure);
    const throttledWidth = throttle(() => {
      this._figure.style.width = this.getParentWidth(this._figure);
    }, 200);
    window.addEventListener('resize', throttledWidth);
  }

  getParentWidth(figure) {
    return figure.parentNode.offsetWidth + 'px';
  }

  render() {
    const resource = this.props.resource;
    const attr = resource.attributes;

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
            <i className={`manicon manicon-resource-${attr.kind}`}></i>
            <span className="resource-type">
              {attr.kind}
            </span>
            <span className="resource-date">
              {
                `Uploaded
                ${moment().month(attr.createdMonth - 1).format("MMMM")},
                ${attr.createdYear}`
              }
            </span>
          </div>
        </div>
      </figure>
    );
  }
}
