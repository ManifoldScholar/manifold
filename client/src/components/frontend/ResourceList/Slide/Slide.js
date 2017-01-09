import React, { Component, PropTypes } from 'react';
import throttle from 'lodash/throttle';
import format from 'date-fns/format';
import parse from 'date-fns/parse';

export default class ResourceSlideFigure extends Component {
  static propTypes = {
    resource: PropTypes.object
  };

  constructor() {
    super();
    this.getParentWidth = this.getParentWidth.bind(this);
  }

  componentDidMount() {
    if (this._figure) {
      this._figure.style.width = this.getParentWidth(this._figure);
      this.throttledWidth = throttle(() => {
        this._figure.style.width = this.getParentWidth(this._figure);
      }, 200);
      window.addEventListener('resize', this.throttledWidth);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.throttledWidth);
  }

  getParentWidth(figure) {
    return figure.parentNode.offsetWidth + 'px';
  }

  render() {
    const resource = this.props.resource;
    const attr = resource.attributes;

    const tmp = `${attr.createdMonth}/1/${attr.createdYear}`;
    const createdDate = format(parse(tmp), 'MMMM, YYYY');

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
              {`Uploaded ${createdDate}`}
            </span>
          </div>
        </div>
      </figure>
    );
  }
}
