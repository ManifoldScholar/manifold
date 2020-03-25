import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ResourcePlayer from "frontend/components/resource-player";
import throttle from "lodash/throttle";
import SlideDefault from "frontend/components/resource-slide/SlideDefault";
import Zoom from "./Zoom";

export default class ResourceListSlideInteractive extends PureComponent {
  static displayName = "ResourceList.Slide.Interactive";

  static propTypes = {
    resource: PropTypes.object.isRequired,
    flexibleHeight: PropTypes.bool,
    enableZoom: PropTypes.bool
  };

  static defaultProps = {
    enableZoom: true,
    flexibleHeight: false
  };

  constructor(props) {
    super(props);
    this.state = {
      containerWidth: 0,
      containerHeight: 0
    };

    this.updateStateOnResize = throttle(this.updateContainerState, 100);
  }

  get resource() {
    return this.props.resource;
  }

  get poster() {
    const { resource } = this.props;
    if (!resource.attributes.variantPosterStyles) return null;
    return resource.attributes.variantPosterStyles.mediumLandscape;
  }

  get backgroundImage() {
    return this.poster || "/static/images/resource-splash.png";
  }

  get showInfo() {
    // do not place the info box over the background if there is a poster
    return !this.poster;
  }

  componentDidMount() {
    this.updateContainerState();
    window.addEventListener("resize", this.updateStateOnResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateStateOnResize);
  }

  setContainer = el => {
    this.containerRef = el;
  };

  updateContainerState = () => {
    this.setState({
      containerWidth: this.containerWidth(),
      containerHeight: this.containerHeight()
    });
  };

  containerWidth() {
    if (!this.containerRef) return 0;
    return this.containerRef.offsetWidth;
  }

  containerHeight() {
    if (!this.containerRef) return 0;
    return this.containerRef.offsetHeight;
  }

  containerIsWideEnough() {
    return this.minimumWidth() <= this.state.containerWidth;
  }

  containerIsTallEnough() {
    if (this.props.flexibleHeight) return true;
    return this.minimumHeight() <= this.state.containerHeight;
  }

  minimumHeight() {
    return this.props.resource.attributes.minimumHeight || 0;
  }

  minimumWidth() {
    return this.props.resource.attributes.minimumWidth || 0;
  }

  get canShowIFrame() {
    if (this.poster) return false;
    return this.containerIsWideEnough() && this.containerIsTallEnough();
  }

  renderSlideContents() {
    const { resource } = this.props;
    if (this.canShowIFrame) {
      return (
        <ResourcePlayer.Iframe
          resource={resource}
          styleProps={{ height: "100%" }}
        />
      );
    }

    return (
      <SlideDefault
        resource={resource}
        info={this.showInfo}
        backgroundUrl={this.poster}
      />
    );
  }

  render() {
    const { resource, enableZoom } = this.props;
    return (
      <div ref={this.setContainer} style={{ width: "100%", height: "100%" }}>
        {enableZoom && (
          <Zoom label={"View interactive resource"} resource={resource} />
        )}
        {this.renderSlideContents()}
      </div>
    );
  }
}
