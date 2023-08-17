import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ResourcePlayer from "frontend/components/resource-player";
import throttle from "lodash/throttle";
import SlideDefault from "frontend/components/resource-slide/SlideDefault";
import Zoom from "./Zoom";
import { withTranslation } from "react-i18next";
import * as Styled from "./styles";

class ResourceListSlideInteractive extends PureComponent {
  static displayName = "ResourceList.Slide.Interactive";

  static propTypes = {
    resource: PropTypes.object.isRequired,
    flexibleHeight: PropTypes.bool,
    enableZoom: PropTypes.bool,
    t: PropTypes.func
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
    return resource.attributes.variantPosterStyles.largeLandscape;
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
    const minWidth = this.minimumWidth();
    if (/^\d+[px]*$/.test(minWidth))
      return parseInt(minWidth, 10) <= this.state.containerWidth;
    if (minWidth.includes("rem"))
      return parseInt(minWidth, 10) * 16 <= this.state.containerWidth;
    if (minWidth.includes("vw"))
      return (
        parseInt(minWidth, 10) * (window.innerWidth * 0.01) <=
        this.state.containerWidth
      );
    return false;
  }

  containerIsTallEnough() {
    if (this.props.flexibleHeight) return true;
    const minHeight = this.minimumHeight();
    if (/^\d+[px]*$/.test(minHeight))
      return parseInt(minHeight, 10) <= this.state.containerHeight;
    if (minHeight.includes("rem"))
      return parseInt(minHeight, 10) * 16 <= this.state.containerHeight;
    if (minHeight.includes("vh"))
      return (
        parseInt(minHeight, 10) * (window.innerHeight * 0.01) <=
        this.state.containerHeight
      );
    return false;
  }

  minimumHeight() {
    return this.props.resource.attributes.minimumHeight || 600;
  }

  minimumWidth() {
    return this.props.resource.attributes.minimumWidth || 800;
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
      <Styled.InteractiveWrapper ref={this.setContainer}>
        {enableZoom && (
          <Zoom
            label={this.props.t("navigation.view_interactive_resource")}
            resource={resource}
          />
        )}
        {this.renderSlideContents()}
      </Styled.InteractiveWrapper>
    );
  }
}

export default withTranslation()(ResourceListSlideInteractive);
