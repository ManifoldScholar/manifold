import React, { Component, PropTypes } from 'react';
import throttle from 'lodash/throttle';
import { DefaultPlayer as Video } from 'react-html5video';

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
    const w = figure.parentNode.offsetWidth;
    return w + 'px';
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
    return (
      <div
        className="figure-video"
        ref={ (c) => {
          this._figure = c;
        }}
      >
        {output}
      </div>
    );
  }

  renderFileVideo(resource) {
    return (
      <div className="figure-video">
        <Video
          controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
        >
          <source src={resource.attributes.attachmentStyles.original} type="video/mp4" />
        </Video>
      </div>
    );
  }

  renderVideo(resource) {
    if (resource.attributes.externalType) {
      return this.renderVideoByService(
        resource.attributes.externalType,
        resource.attributes.externalId
      );
    }
    return this.renderFileVideo(resource);
  }

  render() {
    const resource = this.props.resource;

    return (
      <figure>
        {this.renderVideo(resource)}
      </figure>
    );
  }
}
