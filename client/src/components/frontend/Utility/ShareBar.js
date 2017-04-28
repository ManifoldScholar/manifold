import React, { Component, PropTypes } from 'react';
import { TwitterButton, FacebookButton } from 'react-social';
import HigherOrder from 'containers/global/HigherOrder';

class ShareBar extends Component {

  static displayName = "Utility.ShareBar";

  static propTypes = {
    label: PropTypes.string,
    url: PropTypes.string,
    message: PropTypes.string,
    settings: PropTypes.object
  };

  static defaultProps = {
    label: 'Share'
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
      this.setState({ // eslint-disable-line react/no-did-mount-set-state
        inBrowser: true
      });
    }
  }

  facebookAppId() {
    const { settings } = this.props;
    return settings.attributes.general.facebookAppId;
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
        { this.props.label ?
            <span>{this.props.label}</span> : null
        }
        <ul>
          <li>
            <TwitterButton
              url={this.url()}
              message={this.message()}
              windowOptions={twitterWindowOptions}
            >
              <i className="manicon manicon-twitter"></i>
            </TwitterButton>
          </li>
          {/* Facebook App Id is required for this component to load */}
          {this.facebookAppId() ?
            <li>
              <FacebookButton
                url={this.url()}
                appId={this.facebookAppId()}
                message={this.message()}
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
                <i className="manicon manicon-envelope-simple"></i>
              </EmailButton>
            </li>
          */}
        </ul>
      </nav>
    );
  }
}

export default HigherOrder.withSettings(ShareBar);
