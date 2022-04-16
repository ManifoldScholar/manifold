import React, { Component } from "react";
import PropTypes from "prop-types";
import Info from "./Info";
import * as Styled from "./styles";

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
        <Styled.Default style={{ backgroundImage: `url(${backgroundUrl})` }}>
          {info && <Info resource={resource} />}
        </Styled.Default>
      </>
    );
  }
}
