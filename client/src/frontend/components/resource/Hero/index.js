import React, { Component } from "react";
import PropTypes from "prop-types";
import ResourceSlide from "frontend/components/resource-slide";
import ResourcePlayer from "frontend/components/resource-player";
import * as Styled from "./styles";

export default class ResourceHero extends Component {
  static displayName = "Resource.Hero";

  static propTypes = {
    resource: PropTypes.object,
    slideOptions: PropTypes.object
  };

  static defaultProps = {
    slideOptions: {}
  };

  getFigureByType = resource => {
    const minHeight = resource.attributes.minimumHeight;
    const finalMinHeight = /^\d+$/.test(minHeight)
      ? `${minHeight}px`
      : minHeight;

    let output = null;
    switch (resource.attributes.kind) {
      case "image":
        output = (
          <Styled.Resource>
            <ResourceSlide.SlideImage
              resource={resource}
              {...this.props.slideOptions}
            />
          </Styled.Resource>
        );
        break;
      case "video":
        output = (
          <Styled.Resource>
            <ResourceSlide.SlideVideo
              resource={resource}
              {...this.props.slideOptions}
            />
          </Styled.Resource>
        );
        break;
      case "interactive":
        output = (
          <Styled.Resource
            className="resource-slide-interactive"
            $minHeight={finalMinHeight}
          >
            <ResourcePlayer.Iframe
              resource={resource}
              styleProps={{ minHeight: "100%" }}
            />
          </Styled.Resource>
        );
        break;
      case "audio":
        output = (
          <Styled.ResourceAudio>
            <ResourceSlide.SlideAudio
              resource={resource}
              {...this.props.slideOptions}
            />
          </Styled.ResourceAudio>
        );
        break;
      default:
    }

    return output;
  };

  render() {
    return (
      <Styled.Hero>{this.getFigureByType(this.props.resource)}</Styled.Hero>
    );
  }
}
