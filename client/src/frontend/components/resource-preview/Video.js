import React, { Component } from "react";
import Player from "frontend/components/resource-player";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default class ResourcePreviewVideo extends Component {
  static displayName = "Resource.Preview.Video";

  static propTypes = {
    resource: PropTypes.object.isRequired
  };

  render() {
    const resource = this.props.resource;

    return (
      <Styled.VideoWrapper
        $external={resource.attributes.subKind === "external_video"}
      >
        <Player.Video resource={resource} />
      </Styled.VideoWrapper>
    );
  }
}
