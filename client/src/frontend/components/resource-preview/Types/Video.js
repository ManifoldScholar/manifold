import { Component } from "react";
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
    const PlayerComponent =
      resource.attributes.subKind === "external_video"
        ? Player.ExternalVideo
        : Player.Video;

    return (
      <Styled.VideoWrapper
        $external={resource.attributes.subKind === "external_video"}
      >
        <PlayerComponent resource={resource} />
      </Styled.VideoWrapper>
    );
  }
}
