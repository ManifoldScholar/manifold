import React, { Component } from "react";
import PropTypes from "prop-types";

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
          <div className="no-image">
            <i className="manicon manicon-person" aria-hidden="true" />
          </div>
        )}
        <figcaption>{attr.fullName}</figcaption>
      </figure>
    );
  }
}
