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
        { attr.avatarStyles.smallSquare ?
            <img src={attr.avatarStyles.smallSquare} /> :
            <div className="no-image">
              <i className="manicon manicon-person"></i>
            </div>
        }
        <figcaption>
          {attr.fullName}
        </figcaption>
      </figure>
    );
  }
}
