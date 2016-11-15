import React, { Component, PropTypes } from 'react';

export default class ResourceSlideFigureImage extends Component {
  static propTypes = {
    resource: PropTypes.object
  };

  componentDidMount() {
    const parentWidth = this._figure.parentNode.offsetWidth;
    this._figure.style.width = parentWidth + 'px';
  }

  render() {
    return (
      <figure>
        <div className="figure-image"
          ref={ (c) => {
            this._figure = c;
          } }
          style={ {
            backgroundImage: 'url(' + this.props.resource.attributes.attachmentUrl + ')'
          } }
        >
        </div>
      </figure>
    );
  }
}
