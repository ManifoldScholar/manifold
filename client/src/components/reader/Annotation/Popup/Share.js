import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import HigherOrder from 'containers/global/HigherOrder';
import { EmailButton, TwitterButton, FacebookButton } from 'react-sociable';
import Button from './Button';
import Panel from './Panel';

class AnnotationPopupShare extends PureComponent {

  static displayName = "Annotation.Popup.Share";

  static propTypes = {
    selectionText: PropTypes.string,
    shareUrl: PropTypes.string,
    back: PropTypes.func.isRequired,
    secondary: PropTypes.string,
    direction: PropTypes.string,
    cite: PropTypes.func.isRequired,
    text: PropTypes.object,
    section: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      inBrowser: false
    };
    this.twitterWindowOptions = ["", "", "width=600,height=300"];
  }

  componentDidMount() {
    if (this.state.inBrowser === false) {
      this.setState({ // eslint-disable-line react/no-did-mount-set-state
        inBrowser: true
      });
    }
  }

  facebookAppId() {
    const { settings } = this.props;
    return settings.attributes.integrations.facebookAppId;
  }

  url() {
    if (!this.state.inBrowser) return null;
    return location.hostname + this.props.shareUrl;
  }

  message() {
    return `"${this.props.text}" from Manifold:`;
  }

  canCite() {
    if (!this.props.section) return false;
    const attr = this.props.text.attributes;
    const citations = Object.keys(attr.citations);
    return citations.length > 0;
  }

  render() {
    return (
      <Panel
        primary={false}
        name="share"
        secondary={this.props.secondary}
        direction={this.props.direction}
      >
        {this.canCite() ?
          <Button
            onClick={this.props.cite}
            requiredRole="any"
            label="Cite"
            iconClass="manicon-quotes-left"
          />
          : null
        }
        <TwitterButton
          url={this.url()}
          message={this.message()}
          windowOptions={this.twitterWindowOptions}
        >
          <i className="manicon manicon-twitter"></i>
          {'Twitter'}
        </TwitterButton>
        {this.facebookAppId() ?
          <FacebookButton
            url={this.url()}
            message={this.message()}
            windowOptions={this.twitterWindowOptions}
            appId={this.facebookAppId()}
          >
            <i className="manicon manicon-facebook"></i>
            {'Facebook'}
          </FacebookButton> : null
        }
        <Button
          onClick={this.props.back}
          requiredRole="any"
          label="Back"
          className="dark"
          iconClass="manicon-arrow-bold-left"
        />
      </Panel>
    );
  }
}

export default HigherOrder.withSettings(AnnotationPopupShare);
