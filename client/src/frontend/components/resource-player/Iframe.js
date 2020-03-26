import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ResourcePlayerIframe extends Component {
  static displayName = "Resource.Player.Iframe";

  static propTypes = {
    resource: PropTypes.object.isRequired,
    styleProps: PropTypes.object
  };

  render() {
    const { resource, styleProps } = this.props;
    const {
      externalUrl,
      titlePlaintext,
      minimumHeight,
      minimumWidth
    } = resource.attributes;

    return (
      <div className="figure-interactive">
        <iframe
          src={externalUrl}
          title={titlePlaintext}
          style={{
            minHeight: minimumHeight,
            minWidth: Math.min(minimumWidth, 1135),
            ...styleProps
          }}
        />
      </div>
    );
  }
}
