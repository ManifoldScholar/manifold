import React, { Component } from "react";
import PropTypes from "prop-types";
import { TwitterButton, FacebookButton } from "react-sociable";
import IconComposer from "global/components/utility/IconComposer";

import withSettings from "hoc/with-settings";

class ShareBar extends Component {
  static displayName = "Utility.ShareBar";

  static propTypes = {
    label: PropTypes.string,
    url: PropTypes.string,
    message: PropTypes.string,
    settings: PropTypes.object
  };

  static defaultProps = {
    label: "Share"
  };

  constructor() {
    super();
    this.state = {
      inBrowser: false
    };
  }

  componentDidMount() {
    // This won't be run by the server, so set an instance variable here
    // that will be hidden otherwise
    if (this.state.inBrowser === false) {
      /* eslint-disable react/no-did-mount-set-state */
      this.setState({
        inBrowser: true
      });
      /* eslint-enable react/no-did-mount-set-state */
    }
  }

  facebookAppId() {
    const { settings } = this.props;
    return settings.attributes.integrations.facebookAppId;
  }

  message() {
    if (this.props.message) return this.props.message;
    const { settings } = this.props;
    return settings.attributes.general.socialShareMessage;
  }

  url() {
    if (!this.state.inBrowser) return null;
    const url = location.hostname + this.props.url;
    return url;
  }

  render() {
    if (!this.state.inBrowser) return null;
    if (!this.props.settings) return null;

    const twitterWindowOptions = ["", "", "width=600,height=300"];

    return (
      <nav className="share-nav-primary">
        {this.props.label && (
          <span className="share-nav-primary__label">{this.props.label}</span>
        )}
        <ul className="share-nav-primary__list">
          <li className="share-nav-primary__item">
            <TwitterButton
              url={this.url()}
              message={this.message()}
              windowOptions={twitterWindowOptions}
              className="share-nav-primary__link"
            >
              <IconComposer icon="socialTwitter32" size={20} />
              <span className="screen-reader-text">Share on Twitter</span>
            </TwitterButton>
          </li>
          {/* Facebook App Id is required for this component to load */}
          {this.facebookAppId() ? (
            <li className="share-nav-primary__item">
              <FacebookButton
                url={this.url()}
                appId={this.facebookAppId()}
                message={this.message()}
                windowOptions={twitterWindowOptions}
                className="share-nav-primary__link"
              >
                <IconComposer icon="socialFacebook32" size={20} />
                <span className="screen-reader-text">Share on Facebook</span>
              </FacebookButton>
            </li>
          ) : null}
        </ul>
      </nav>
    );
  }
}

export default withSettings(ShareBar);
