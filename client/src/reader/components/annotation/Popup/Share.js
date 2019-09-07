import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { TwitterButton, FacebookButton } from "react-sociable";
import Button from "./parts/Button";
import Panel from "./parts/Panel";
import lh from "helpers/linkHandler";
import trim from "lodash/trim";
import IconComposer from "global/components/utility/IconComposer";

import withSettings from "hoc/with-settings";

class AnnotationPopupSecondaryShare extends PureComponent {
  static displayName = "Annotation.Popup.Secondary.Share";

  static propTypes = {
    primary: PropTypes.bool.isRequired,
    visible: PropTypes.bool.isRequired,
    selection: PropTypes.object,
    onBackClick: PropTypes.func.isRequired,
    onCiteClick: PropTypes.func.isRequired,
    direction: PropTypes.string.isRequired,
    text: PropTypes.object,
    section: PropTypes.object,
    settings: PropTypes.object
  };

  static defaultProps = {
    primary: false,
    visible: false
  };

  constructor(props) {
    super(props);
    this.state = { inBrowser: false };
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
    const readerUrl = lh.link(
      "readerSection",
      this.props.text.attributes.slug,
      this.props.section.id
    );
    const url = `${window.location.hostname}${readerUrl}`;
    const node = this.startNodeUuid();

    if (!node) return url;
    return `${url}#node-${node}`;
  }

  startNodeUuid() {
    const selection = this.props.selection;
    if (!selection || !selection.startNode) return null;
    return selection.startNode.dataset.nodeUuid;
  }

  message() {
    if (!this.props.selection) return null;
    const text = trim(this.props.selection.text);
    if (text.length === 0) {
      return `Read "${this.props.text.attributes.titlePlaintext}" on Manifold:`;
    }
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
        primary={this.props.primary}
        visible={this.props.visible}
        direction={this.props.direction}
      >
        {this.canCite() ? (
          <Button
            onClick={this.props.onCiteClick}
            kind="any"
            label="Cite"
            icon="socialCite32"
          />
        ) : null}
        <TwitterButton
          url={this.url()}
          message={this.message()}
          windowOptions={this.twitterWindowOptions}
          className="annotation-popup__button"
        >
          <IconComposer
            icon="socialTwitter32"
            size={24}
            iconClass="annotation-popup__button-icon"
          />
          <span className="annotation-popup__button-text">{"Twitter"}</span>
        </TwitterButton>
        {this.facebookAppId() ? (
          <FacebookButton
            url={this.url()}
            message={this.message()}
            windowOptions={this.twitterWindowOptions}
            appId={this.facebookAppId()}
            className="annotation-popup__button"
          >
            <IconComposer
              icon="socialFacebook32"
              size={24}
              iconClass="annotation-popup__button-icon"
            />
            <span className="annotation-popup__button-text">{"Facebook"}</span>
          </FacebookButton>
        ) : null}
        <Button
          onClick={this.props.onBackClick}
          kind="any"
          label="Back"
          className="annotation-popup__button--dark"
          icon="arrowLeft32"
        />
      </Panel>
    );
  }
}

export default withSettings(AnnotationPopupSecondaryShare);
