import React, { Component } from "react";
import PropTypes from "prop-types";
import { DefaultPlayer as Video } from "react-html5video";
import withDispatch from "hoc/with-dispatch";
import { notificationActions } from "actions";

class ResourcePlayerVideo extends Component {
  static displayName = "Resource.Player.Video";

  static propTypes = {
    resource: PropTypes.object,
    dispatch: PropTypes.func
  };

  constructor() {
    super();
    this.playerRef = React.createRef();
    this.state = { inBrowser: false };
  }

  /* eslint-disable react/no-did-mount-set-state */
  componentDidMount() {
    if (!this.state.inBrowser) {
      this.setState({ inBrowser: true });
    }
  }
  /* eslint-enable react/no-did-mount-set-state */

  renderVideoByService(service, id) {
    let output = false;
    if (service === "vimeo") {
      output = (
        <iframe
          src={`//player.vimeo.com/video/${id}`}
          frameBorder="0"
          title={`vimeo-${id}`}
          allowFullScreen
        />
      );
    }
    if (service === "youtube") {
      output = (
        <iframe
          id="ytplayer"
          type="text/html"
          src={`https://www.youtube.com/embed/${id}?rel=0`}
          frameBorder="0"
          title={`yt-${id}`}
          allowFullScreen
        />
      );
    }
    return <div className="figure-video">{output}</div>;
  }

  handleError = eventIgnored => {
    const hasDownload = this.props.resource.attributes.allowDownload;
    const notification = {
      level: 1,
      id: `VIDEO_PLAYBACK_ERROR`,
      heading: "Unable to play video.",
      body: `Your browser is not able to play this video. ${hasDownload &&
        "You may download it and play it locally using the download button below."}`,
      expiration: 5000
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  };

  renderFileVideo(resource) {
    if (!this.state.inBrowser) return null;

    return (
      <div className="figure-video">
        <Video
          ref={this.playerRef}
          controls={["PlayPause", "Seek", "Time", "Volume", "Fullscreen"]}
          poster={resource.attributes.variantPosterStyles.mediumLandscape}
          onError={this.handleError}
        >
          <source
            src={resource.attributes.attachmentStyles.original}
            type="video/mp4"
          />
        </Video>
      </div>
    );
  }

  renderVideo(resource) {
    if (resource.attributes.subKind === "external_video") {
      return this.renderVideoByService(
        resource.attributes.externalType,
        resource.attributes.externalId
      );
    }
    return this.renderFileVideo(resource);
  }

  render() {
    const resource = this.props.resource;
    return this.renderVideo(resource);
  }
}

export default withDispatch(ResourcePlayerVideo);
