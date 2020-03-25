import React, { Component } from "react";
import PropTypes from "prop-types";
import ResourceSlide from "frontend/components/resource-slide";
import ResourcePlayer from "frontend/components/resource-player";

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
    let output = null;
    switch (resource.attributes.kind) {
      case "image":
        output = (
          <div className="resource-slide-figure">
            <ResourceSlide.SlideImage
              resource={resource}
              {...this.props.slideOptions}
            />
          </div>
        );
        break;
      case "video":
        output = (
          <div className="resource-slide-figure">
            <ResourceSlide.SlideVideo
              resource={resource}
              {...this.props.slideOptions}
            />
          </div>
        );
        break;
      case "interactive":
        output = (
          <div className="resource-slide-figure resource-slide-interactive">
            <ResourcePlayer.Iframe
              resource={resource}
              styleProps={{ minHeight: "100%" }}
            />
          </div>
        );
        break;
      case "audio":
        output = (
          <div className="resource-slide-figure resource-slide-audio">
            <ResourceSlide.SlideAudio
              resource={resource}
              {...this.props.slideOptions}
            />
          </div>
        );
        break;
      default:
    }

    return output;
  };

  render() {
    return (
      <section className="resource-hero-container">
        <div className="resource-hero">
          {this.getFigureByType(this.props.resource)}
        </div>
      </section>
    );
  }
}
