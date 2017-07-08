import React, { Component } from "react";
import PropTypes from "prop-types";
import throttle from "lodash/throttle";

export default class ResourceListSlideFigureImage extends Component {
  static propTypes = {
    resource: PropTypes.object
  };

  constructor() {
    super();
    this.getParentWidth = this.getParentWidth.bind(this);
  }

  componentDidMount() {
    if (this._figure) {
      this._figure.style.width = this.getParentWidth(this._figure);
      this.throttledWidth = throttle(() => {
        this._figure.style.width = this.getParentWidth(this._figure);
      }, 200);
      window.addEventListener("resize", this.throttledWidth);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.throttledWidth);
  }

  getParentWidth(figure) {
    return figure.parentNode.offsetWidth + "px";
  }

  render() {
    const attr = this.props.resource.attributes;
    return (
      <figure>
        <div
          className="figure-image"
          ref={c => {
            this._figure = c;
          }}
          style={{
            backgroundImage: "url(" + attr.attachmentStyles.medium + ")"
          }}
        />
      </figure>
    );
  }
}
