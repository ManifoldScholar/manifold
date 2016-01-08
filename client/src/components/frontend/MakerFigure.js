import React, { Component, PropTypes } from 'react';

export default class MakerFigure extends Component {

  static propTypes = {
    maker: PropTypes.object
  };

  render = () => {
    return (
        <figure className="maker-avatar" key={this.props.maker.id}>
          {/* If avatars will not be pre-rendered as squares they will require a styled
          wrapper here */}
          <img src="/placeholder/user-avatar-nornes01.jpg"/>
          <figcaption>
            {this.props.maker.attributes.name}
          </figcaption>
        </figure>
    );
  };
}
