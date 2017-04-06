import React, { PureComponent, PropTypes } from 'react';
import { EmailButton, TwitterButton, FacebookButton } from 'react-social';
import HigherOrder from 'containers/global/HigherOrder';
class AnnotationPopupShareSocialButtons extends PureComponent {

  static displayName = "Annotation.Popup.Share.SocialButtons";

  static propTypes = {
    url: PropTypes.string,
    text: PropTypes.string
  };

  facebookAppId() {
    const { settings } = this.props;
    return settings.attributes.general.facebookAppId;
  }

  render() {
    if (!this.props.settings) return null;
    const twitterWindowOptions = ["", "", "width=600,height=300"];
    const shareMessage = `"${this.props.text}" from Manifold:`;

    return (
      <div className="button-group">
        {/*
          Hidden for now
          NB: Email url contains message because it doesn't use a
          separate message parameter
          <EmailButton
            url={shareMessage + this.props.url}
            windowOptions={twitterWindowOptions}
          >
            <i className="manicon manicon-envelope"></i>
            {'Email'}
          </EmailButton>
         */}
        <TwitterButton
          url={this.props.url}
          message={shareMessage}
          windowOptions={twitterWindowOptions}
          onMouseEnter={this.props.handleTailHighlight}
          onMouseLeave={this.props.handleTailBlur}
        >
          <i className="manicon manicon-twitter"></i>
          {'Twitter'}
        </TwitterButton>
        {this.facebookAppId() ?
          <FacebookButton
            url={this.props.url}
            appId={this.facebookAppId()}
            message={shareMessage}
            windowOptions={twitterWindowOptions}
          >
            <i className="manicon manicon-facebook"></i>
            {'Facebook'}
          </FacebookButton> : null
        }
      </div>
    );
  }
}

export default HigherOrder.withSettings(AnnotationPopupShareSocialButtons);
