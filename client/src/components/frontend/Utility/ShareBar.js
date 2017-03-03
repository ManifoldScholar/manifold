import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { TwitterButton, FacebookButton } from 'react-social';

export default class ShareBar extends Component {

  static displayName = "Utility.ShareBar";

  static propTypes = {
    url: PropTypes.string,
    twitterAppId: PropTypes.string,
    facebookAppId: PropTypes.string
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
    this.setState({
      inBrowser: true
    });
  }

  render() {
    if (!this.state.inBrowser) return null;

    const twitterWindowOptions = ["", "", "width=600,height=300"];
    const twitterAppId = this.props.twitterAppId ? this.props.twitterAppId : null;
    const facebookAppId = this.props.facebookAppId ? this.props.facebookAppId : null;
    const url = location.hostname + this.props.url;

    return (
      <nav className="share-nav-primary">
        <span>Share</span>
        <ul>
          <li>
            <TwitterButton
              url={url}
              appId={twitterAppId}
              windowOptions={twitterWindowOptions}
            >
              <i className="manicon manicon-twitter"></i>
            </TwitterButton>
          </li>
          {/* Facebook App Id is required for this component to load */}
          {facebookAppId ?
            <li>
              <FacebookButton
                url={url}
                appId={facebookAppId}
                windowOptions={twitterWindowOptions}
              >
                <i className="manicon manicon-facebook"></i>
              </FacebookButton>
            </li> : null
          }
          {/*
            Hiding email share button until we have more robust
            functionality for custom mailing
            NB: `EmailButton` component from react-social required
            for this one in particular.

            <li>
              <EmailButton url={this.props.url}>
                <i className="manicon manicon-envelope"></i>
              </EmailButton>
            </li>
          */}
        </ul>
      </nav>
    );
  }
}
