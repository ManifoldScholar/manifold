import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import FormattedDate from 'components/global/FormattedDate';

export default class ResourceListSlideFigure extends Component {
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
              <FormattedDate
                prefix="Uploaded"
                format="MMMM, YYYY"
                date={attr.createdAt}
              />
            </span>
          </div>
        </div>
      </figure>
    );
  }
}
