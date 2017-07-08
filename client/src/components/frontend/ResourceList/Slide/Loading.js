import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ResourceListSlideFigureLoading extends Component {
  static displayName = "ResourceList.Slide.Loading";

  static propTypes = {
    resource: PropTypes.object
  };

  componentDidMount() {
    if (!this._figure) return null;
    const parentWidth = this._figure.parentNode.offsetWidth;
    this._figure.style.width = parentWidth + "px";
  }

  render() {
    return (
      <figure>
        <div
          ref={c => {
            this._figure = c;
          }}
          className="figure-default"
          style={{ backgroundImage: "url(/static/images/resource-splash.png)" }}
        >
          <div className="resource-info">
            <i className={`manicon manicon-resource-file`} />
            <span className="resource-type">
              {"loading"}
            </span>
            <span className="resource-date">
              {"loading"}
            </span>
          </div>
        </div>
      </figure>
    );
  }
}
