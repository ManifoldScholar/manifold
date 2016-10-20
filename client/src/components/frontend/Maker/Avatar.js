import React, { Component, PropTypes } from 'react';

export default class MakerAvatar extends Component {

  static displayName = "Maker.Avatar";

  static propTypes = {
    maker: PropTypes.object
  };

  render() {
    const attr = this.props.maker.attributes;
    return (
      <figure className="maker-avatar" key={this.props.maker.id}>
        {/* If avatars will not be pre-rendered as squares they will require a styled
        wrapper here */}
        { attr.avatarUrl ? <img src={attr.avatarUrl} /> : null }
        <figcaption>
          {attr.fullName}
        </figcaption>
      </figure>
    );
  }
}
