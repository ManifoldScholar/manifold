import React, { Component, PropTypes } from 'react';

export default class ResourceSlideFigureImage extends Component {
  static propTypes = {
    resource: PropTypes.object
  };

  render() {
    console.log(this.props.resource);
    return (
      <figure className="figure-image"
        style={ { backgroundImage: 'url(' + this.props.resource.attributes.image + ')' } }
      >
      </figure>
    );
  }
}
