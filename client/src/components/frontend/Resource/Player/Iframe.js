import React, { Component } from "react";
import PropTypes from "prop-types";
import throttle from "lodash/throttle";
import { ResourceList } from "components/frontend";
import { closest } from "utils/domUtils";

export default class ResourcePlayerIframe extends Component {
  static propTypes = {
    resource: PropTypes.object.isRequired,
    flexibleHeight: PropTypes.bool,
    noPlaceholder: PropTypes.bool
  };

  static defaultProps = {
    flexibleHeight: false,
    noPlaceholder: false
  };

  constructor(props) {
    super(props);
    this.state = {
      containerWidth: 0,
      containerHeight: 0
    };
  }

  componentDidMount() {
    this.updateContainerState();
    window.addEventListener("resize", this.updateStateOnResize);
  }

  componentDidUpdate(_prevProps, prevState) {
    const w = this.containerWidth();
    const h = this.containerHeight();
    if (prevState.containerWidth !== w || prevState.containerHeight !== h) {
      this.updateContainerState(w, h);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateStateOnResize);
  }

  setContainer = el => {
    this.containerRef = closest(el, parent => {
      if (parent.offsetHeight > 0) return true;
    });
  };

  updateContainerState = (w = null, h = null) => {
    const containerWidth = w === null ? this.containerWidth() : w;
    const containerHeight = h === null ? this.containerHeight() : h;
    this.setState({ containerWidth, containerHeight });
  };

  updateStateOnResize = throttle(() => {
    this.updateContainerState();
  }, 100);

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
    const { minimumHeight } = this.props.resource.attributes;
    if (!minimumHeight) return 800;
    return minimumHeight;
  }

  minimumWidth() {
    const { minimumWidth } = this.props.resource.attributes;
    if (!minimumWidth) return 1020;
    return minimumWidth;
  }

  canShowIFrame() {
    if (this.props.noPlaceholder) return true;
    return this.containerIsWideEnough() && this.containerIsTallEnough();
  }

  renderIframe() {
    const { resource } = this.props;
    const style = {
      minHeight: this.minimumHeight(),
      minWidth: this.minimumWidth(),
      width: "100%"
    };
    if (!this.props.noPlaceholder) {
      style.height = this.containerHeight();
    }
    return (
      <iframe
        src={resource.attributes.externalUrl}
        title={resource.attributes.titlePlaintext}
        style={style}
      />
    );
  }

  renderPlaceholder() {
    return <ResourceList.Slide.Slide {...this.props} />;
  }

  render() {
    return (
      <div ref={this.setContainer} className="figure-interactive">
        {this.canShowIFrame() ? this.renderIframe() : this.renderPlaceholder()}
      </div>
    );
  }
}
