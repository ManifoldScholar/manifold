import React, { Component } from "react";
import PropTypes from "prop-types";
import { DefaultPlayer as Video } from "react-html5video";
import withDispatch from "hoc/withDispatch";
import { notificationActions } from "actions";
import { withTranslation } from "react-i18next";
import * as Styled from "./styles";

class ResourcePlayerVideo extends Component {
  static displayName = "Resource.Player.Video";

  static propTypes = {
    resource: PropTypes.object,
    dispatch: PropTypes.func,
    t: PropTypes.func
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

  get subKind() {
    return this.props.resource.attributes.subKind;
  }

  get externalType() {
    return this.props.resource.attributes.externalType;
  }

  get externalId() {
    return this.props.resource.attributes.externalId;
  }

  // strip out addtl params from ID (e.g. `Zo6UnKr6Bwg&t=21s`),
  // which can be mistakenly included and cause embeds to fail
  get parsedId() {
    const url = new URL(`http://manifold.lvh/?id=${this.externalId}`);
    const params = new URLSearchParams(url.search);
    return params.get("id");
  }

  get iframeSrc() {
    switch (this.externalType) {
      case "vimeo":
        return `//player.vimeo.com/video/${this.parsedId}`;
      case "youtube":
        return `https://www.youtube.com/embed/${this.parsedId}?rel=0`;
      default:
        return null;
    }
  }

  get iframeTitle() {
    switch (this.externalType) {
      case "vimeo":
        return `vimeo-${this.externalId}`;
      case "youtube":
        return `yt-${this.externalId}`;
      default:
        return null;
    }
  }

  get iframeProps() {
    return {
      src: this.iframeSrc,
      frameBorder: "0",
      allowFullScreen: true,
      type: this.externalType === "youtube" ? "text/html" : null
    };
  }

  get captionsSrc() {
    if (process.env.NODE_ENV !== "development")
      return this.props.resource?.attributes?.captionsTrackUrl;
    if (!this.props.resource.attributes.captionsTrackUrl) return null;

    const trackUrl = new URL(this.props.resource.attributes.captionsTrackUrl);
    const host = trackUrl.host;

    // Use the proxy if running over ports in dev to avoid CORS error
    if (host.includes("localhost")) {
      const appUrl = new URL(window.location.href);
      const appPort = appUrl.port;
      trackUrl.port = appPort;
    }

    return trackUrl;
  }

  renderVideoByService() {
    if (!this.iframeSrc) return null;

    return (
      <Styled.VideoWrapper>
        <Styled.Video title={this.iframeTitle} {...this.iframeProps} />
      </Styled.VideoWrapper>
    );
  }

  handleError = eventIgnored => {
    const hasDownload = this.props.resource.attributes.allowDownload;
    const t = this.props.t;
    const notification = {
      level: 1,
      id: `VIDEO_PLAYBACK_ERROR`,
      heading: t("errors.video_playback.heading"),
      body: `${t("errors.video_playback.body")} ${hasDownload &&
        t("errors.video_playback.download")}`,
      expiration: 5000
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  };

  trackRef = el => {
    if (!el) return;

    // ::cue pseudo-elements cannot be positioned with css. Move
    // them up from the default position, so they aren't covered
    // by the controls overlay.
    el.addEventListener("load", () => {
      if (!el.track?.cues) return;
      Array.from(el.track.cues).forEach(c => {
        // eslint-disable-next-line no-param-reassign
        c.line = -3;
      });
    });
  };

  renderFileVideo() {
    if (!this.state.inBrowser) return null;

    const {
      variantPosterStyles,
      attachmentStyles,
      captionsTrackUrl
    } = this.props.resource.attributes;

    return (
      <Styled.VideoWrapper>
        <Video
          ref={this.playerRef}
          poster={variantPosterStyles.mediumLandscape}
          onError={this.handleError}
        >
          <source src={attachmentStyles.original} type="video/mp4" />
          {!!captionsTrackUrl && (
            <track
              kind="captions"
              src={this.captionsSrc.toString()}
              srcLang="en"
              ref={this.trackRef}
            />
          )}
        </Video>
      </Styled.VideoWrapper>
    );
  }

  render() {
    if (this.subKind === "external_video") return this.renderVideoByService();
    return this.renderFileVideo();
  }
}

export default withDispatch(withTranslation()(ResourcePlayerVideo));
