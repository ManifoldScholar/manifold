import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import HigherOrder from "containers/global/HigherOrder";
import { TwitterButton, FacebookButton } from "react-sociable";
import Button from "../Button";
import Panel from "../Panel";
import lh from "helpers/linkHandler";

class AnnotationPopupSecondaryShare extends PureComponent {
  static displayName = "Annotation.Popup.Secondary.Share";

  static propTypes = {
    selection: PropTypes.object,
    back: PropTypes.func.isRequired,
    secondary: PropTypes.string,
    direction: PropTypes.string,
    cite: PropTypes.func.isRequired,
    text: PropTypes.object,
    section: PropTypes.object,
    settings: PropTypes.object
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

  url() {
    if (!this.state.inBrowser) return null;
    const url = lh.link(
      "readerSection",
      this.props.text.attributes.slug,
      this.props.section.id
    );
    return location.hostname + url;
  }

  message() {
    if (!this.props.selection) return null;
    return `"${this.props.selection.text}" from Manifold:`;
  }

  canCite() {
    if (!this.props.section) return false;
    const attr = this.props.section.attributes;
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
        {this.canCite() ? (
          <Button
            onClick={this.props.cite}
            requiredKind="any"
            label="Cite"
            iconClass="manicon-quotes-left"
          />
        ) : null}
        <TwitterButton
          url={this.url()}
          message={this.message()}
          windowOptions={this.twitterWindowOptions}
        >
          <i className="manicon manicon-twitter" />
          {"Twitter"}
        </TwitterButton>
        {this.facebookAppId() ? (
          <FacebookButton
            url={this.url()}
            message={this.message()}
            windowOptions={this.twitterWindowOptions}
            appId={this.facebookAppId()}
          >
            <i className="manicon manicon-facebook" />
            {"Facebook"}
          </FacebookButton>
        ) : null}
        <Button
          onClick={this.props.back}
          requiredKind="any"
          label="Back"
          className="dark"
          iconClass="manicon-arrow-bold-left"
        />
      </Panel>
    );
  }
}

export default HigherOrder.withSettings(AnnotationPopupSecondaryShare);
