import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class ResourceSlideCaption extends Component {
  static propTypes = {
    resource: PropTypes.object
  };

  constructor() {
    super();
    this.state = {
      expanded: false
    };
    this.handleReadMore = this.handleReadMore.bind(this);
  }

  handleReadMore(event) {
    const transitionClass = 'transition-height';

    if (this._description) {
      this._description.style.height = 'auto';
      const natHeight = this._description.offsetHeight;
      this._description.style.height = '5em';
      if (this._description.classList)
        this._description.classList.add(transitionClass);
      else
        this._description.className += ' ' + transitionClass;

      this._description.style.height = `calc(${natHeight}px + 2.5em)`;
      this._description.style.height = `0`;
      this._description.style.height = `calc(${natHeight}px + 2.5em)`;
    }
  }

  render() {
    const resource = this.props.resource;
    const attr = resource.attributes;

    return (
      <div className="slide-caption">
        <header>
          <h2 className="resource-title">
            {attr.title}
          </h2>
        </header>
        <div
          className="resource-description"
          ref={ (c) => {
            this._description = c;
          } }
        >
          <p>
            {attr.description}
          </p>
        </div>
        <div className="resource-utility">
          <div className="bg-neutral90">
            <button className="more-link" onClick={this.handleReadMore}>
              {'Read More'}
            </button>
            <a href={attr.attachmentUrl} className="download-link">
              {'Download'} <i className="manicon manicon-arrow-down"></i>
            </a>
          </div>
        </div>
      </div>
    );
  }
}
