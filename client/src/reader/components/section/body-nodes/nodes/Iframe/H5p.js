import React, { Component } from "react";
import PropTypes from "prop-types";

export default class H5p extends Component {
  static propTypes = {
    title: PropTypes.string,
    src: PropTypes.string,
    frameBorder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    allowFullScreen: PropTypes.bool
  };

  static defaultProps = {
    title: "Manifold H5P Interactive Element",
    allowFullScreen: true
  };

  render() {
    return (
      <>
        <div style={{ maxWidth: "100%" }}>
          <iframe
            title={this.props.title}
            src={this.props.src}
            width="100%"
            height="3000"
            frameBorder={this.props.frameBorder}
            allowFullScreen={this.props.allowFullScreen}
          />
          <script
            src="https://h5p.org/sites/all/modules/h5p/library/js/h5p-resizer.js"
            charSet="UTF-8"
          />
        </div>
      </>
    );
  }
}
