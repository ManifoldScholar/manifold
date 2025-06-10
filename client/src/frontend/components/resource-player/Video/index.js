import React, { Component } from "react";
import PropTypes from "prop-types";
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
  }

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
      type: this.externalType === "youtube" ? "text/html" : null,
      loading: "lazy",
      width: 560,
      height: 315
    };
  }

  urlToRelativePath(url) {
    const trackUrl = new URL(url);
    return trackUrl.pathname;
  }

  get allowDownload() {
    return this.props.resource.attributes.allowDownload;
  }

  renderVideoByService() {
    if (!this.iframeSrc) return null;

    return (
      <Styled.VideoWrapper>
        <Styled.Iframe title={this.iframeTitle} {...this.iframeProps} />
      </Styled.VideoWrapper>
    );
  }

  handleError = eventIgnored => {
    const t = this.props.t;
    const notification = {
      level: 1,
      id: `VIDEO_PLAYBACK_ERROR`,
      heading: t("errors.video_playback.heading"),
      body: `${t("errors.video_playback.body")} ${this.allowDownload &&
        t("errors.video_playback.download")}`,
      expiration: 5000
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  };

  renderFileVideo() {
    const {
      variantPosterStyles,
      attachmentStyles
    } = this.props.resource.attributes;
    const { textTracks } = this.props.resource.relationships;

    return (
      <Styled.VideoWrapper>
        <Styled.Video
          controls
          controlsList={!this.allowDownload ? "nodownload" : undefined}
          poster={variantPosterStyles.mediumLandscape}
          onError={this.handleError}
          loading="lazy"
        >
          <source src={attachmentStyles.original} type="video/mp4" />
          {!!textTracks.length &&
            textTracks.map(track => {
              if (!track?.attributes) return null;
              const {
                id,
                attributes: { kind, srclang, cuesUrl, label }
              } = track;
              if (!kind || !cuesUrl) return null;
              return (
                <track
                  key={id}
                  src={this.urlToRelativePath(cuesUrl)}
                  kind={kind}
                  label={label}
                  srcLang={srclang}
                />
              );
            })}
        </Styled.Video>
      </Styled.VideoWrapper>
    );
  }

  render() {
    if (this.subKind === "external_video") return this.renderVideoByService();
    return this.renderFileVideo();
  }
}

export default withDispatch(withTranslation()(ResourcePlayerVideo));
