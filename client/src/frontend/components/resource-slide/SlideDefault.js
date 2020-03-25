import React, { Component } from "react";
import PropTypes from "prop-types";
import Info from "./Info";

export default class DefaultSlide extends Component {
  static displayName = "ResourceList.Slide.Default";

  static propTypes = {
    resource: PropTypes.object.isRequired,
    info: PropTypes.bool,
    backgroundUrl: PropTypes.string
  };

  static defaultProps = {
    backgroundUrl: "/static/images/resource-splash.png",
    info: true
  };

  render() {
    const { resource, info, backgroundUrl } = this.props;

    return (
      <>
        <div
          className="figure-default"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        >
          {info && <Info resource={resource} />}
        </div>
      </>
    );
  }
}
