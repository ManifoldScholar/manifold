import React, { Component } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

export default class MakerAvatar extends Component {
  static displayName = "Maker.Avatar";

  static propTypes = {
    maker: PropTypes.object
  };

  render() {
    const attr = this.props.maker.attributes;
    return (
      <figure className="maker-avatar" key={this.props.maker.id}>
        {attr.avatarStyles.smallSquare ? (
          <img src={attr.avatarStyles.smallSquare} alt="User Avatar" />
        ) : (
          <IconComposer icon="avatar64" size="42" />
        )}
        <figcaption>{attr.fullName}</figcaption>
      </figure>
    );
  }
}
