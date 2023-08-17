import React, { Component } from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

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
      minimumWidth,
      iframeAllows
    } = resource.attributes;

    const finalMinHeight = /^\d+$/.test(minimumHeight)
      ? `${minimumHeight}px`
      : minimumHeight;

    const finalMinWidth = /^\d+$/.test(minimumWidth)
      ? `${minimumWidth}px`
      : minimumWidth;

    return (
      <Styled.InteractiveWrapper>
        <Styled.Interactive
          src={externalUrl}
          title={titlePlaintext}
          allow={iframeAllows?.join(" ")}
          style={{
            ...styleProps
          }}
          $minWidth={finalMinWidth}
          $minHeight={finalMinHeight}
        />
      </Styled.InteractiveWrapper>
    );
  }
}
