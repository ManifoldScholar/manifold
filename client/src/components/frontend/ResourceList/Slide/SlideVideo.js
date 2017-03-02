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

  renderVideoByService(service, id) {
    let output = false;
    if (service === 'vimeo') {
      output = (
        <iframe src={`//player.vimeo.com/video/${id}`}
          frameBorder="0"
          allowFullScreen
        >
        </iframe>
      );
    }
    if (service === 'youtube') {
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
