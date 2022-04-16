import React, { Component } from "react";
import PropTypes from "prop-types";
import ResourcePlayer from "frontend/components/resource-player";
import * as Styled from "./styles";

export default class ResourcePreviewInteractive extends Component {
  static displayName = "Resource.Preview.Interactive";

  static propTypes = {
    resource: PropTypes.object.isRequired,
    flexibleHeight: PropTypes.bool
  };

  static defaultProps = {
    flexibleHeight: false
  };

  get minHeight() {
    return this.props.resource.attributes.minimumHeight || 800;
  }

  get styleProps() {
    const styles = { height: "100%" };
    if (!this.props.flexibleHeight) styles.minHeight = this.minHeight;
    return styles;
  }

  render() {
    return (
      <Styled.InteractiveWrapper>
        <ResourcePlayer.Iframe {...this.props} styleProps={this.styleProps} />
      </Styled.InteractiveWrapper>
    );
  }
}
