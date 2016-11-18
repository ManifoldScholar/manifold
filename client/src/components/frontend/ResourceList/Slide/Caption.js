import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

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

    if (this._description && !this.state.expanded) {
      // Open description to full size
      this.openDescription();
    } else if (this._description && this.state.expanded) {
      // Close description if it is open
      this.closeDescription();
    }
  }

  // Can happen even if it's already open, will shrink if need be.
  openDescription() {
    const origHeight = this._description.offsetHeight;
    this._description.style.height = 'auto';
    const natHeight = this._description.offsetHeight;
    this._description.style.height = origHeight + 'px';
    this.setState({expanded: true});

    // Ensure height transition doesn't run until class with transition
    // has been added
    const transitionInterval = setInterval(() => {
      if (this.state.expanded) {
        this._description.style.height = `${natHeight}px`;
        clearInterval(transitionInterval);
        setTimeout(() => {
          this._description.style.height = 'auto';
        }, 250)
      }
    }, 20);
  }

  closeDescription() {
    // Manually set the height to transition back
    this._description.style.height = this._description.offsetHeight + 'px';
    this._description.style.height = '5em';
    // Give a transition amount of time before changing the class state
    setTimeout(() => {
        this.setState({expanded: false});
    }, 250);
  }

  render() {
    const resource = this.props.resource;
    const attr = resource.attributes;
    const descriptionClass = classNames({
      'resource-description': true,
      'transition-height': this.state.expanded
    });

    const moreLinkClass = classNames({
      'more-link': true,
      'open': this.state.expanded
    });

    return (
      <div className="slide-caption">
        <header>
          <h2 className="resource-title">
            {attr.title}
          </h2>
        </header>
        <div
          className={descriptionClass}
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
            <button className={moreLinkClass} onClick={this.handleReadMore}>
              <span className="open-text">
                {'Read More'}
              </span>
              <span className="close-text">
                {'Hide Description'}
              </span>
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
