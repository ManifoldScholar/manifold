import { Component } from "react";
import PropTypes from "prop-types";
import ResourcePlayer from "frontend/components/resource-player";

export default class ResourceListSlideVideo extends Component {
  static displayName = "ResourceList.Slide.Video";

  static propTypes = {
    resource: PropTypes.object.isRequired
  };

  render() {
    const resource = this.props.resource;
    const PlayerComponent =
      resource.attributes.subKind === "external_video"
        ? ResourcePlayer.ExternalVideo
        : ResourcePlayer.Video;

    return <PlayerComponent resource={resource} />;
  }
}
