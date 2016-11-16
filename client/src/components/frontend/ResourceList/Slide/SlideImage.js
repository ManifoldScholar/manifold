import React, { Component, PropTypes } from 'react';
import throttle from 'lodash/throttle';

export default class ResourceSlideFigureImage extends Component {
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
    return (
      <figure>
        <div className="figure-image"
          ref={ (c) => {
            this._figure = c;
          } }
          style={ {
            backgroundImage: 'url(' + this.props.resource.attributes.attachmentUrl + ')'
          } }
        >
        </div>
      </figure>
    );
  }
}
