import React, { Component } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class Avatar extends Component {
  static propTypes = {
    url: PropTypes.string,
    style: PropTypes.object
  };

  render() {
    if (this.props.url) {
      const style = {
        backgroundSize: "cover",
        backgroundPosition: "50% 50%",
        backgroundImage: `url(${this.props.url})`,
        width: "100%",
        height: 0,
        paddingTop: "100%",
        borderRadius: "100%"
      };
      return (
        <figure style={this.props.style} className="avatar">
          <span className="screen-reader-text">Avatar</span>
          <div style={style} />
        </figure>
      );
    }
    return (
      <figure style={this.props.style} className="avatar">
        <Utility.IconComposer className="manicon-person" icon="Avatar64" />
        <span className="screen-reader-text">Avatar</span>
      </figure>
    );
  }
}
