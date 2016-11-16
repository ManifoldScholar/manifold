import React, { Component, PropTypes } from 'react';
import throttle from 'lodash/throttle';

export default class ResourceSlideFigureVideo extends Component {
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

  renderVideoByService(service, id) {
    let output = false;
    if (service === 'VIMEO') {
      output = (
        <iframe src={`//player.vimeo.com/video/${id}`}
          frameBorder="0"
          allowFullScreen
        >
        </iframe>
      );
    }
    if (service === 'YOUTUBE') {
      output = (
        <iframe id="ytplayer" type="text/html"
          src={`https://www.youtube.com/embed/${id}`}
          frameBorder="0"
          allowFullScreen
        >
        </iframe>
      );
    }
    return output;
  }

  render() {
    const resource = this.props.resource;

    return (
      <figure>
        <div
          className="figure-video"
          ref={ (c) => {
            this._figure = c;
          } }
        >
          {this.renderVideoByService(
              resource.attributes.externalType,
              resource.attributes.externalId
          )}
        </div>
      </figure>
    );
  }
}
