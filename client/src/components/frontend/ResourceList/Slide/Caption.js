import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import { VelocityComponent } from 'velocity-react';

export default class ResourceSlideCaption extends Component {
  static propTypes = {
    resource: PropTypes.object
  };

  constructor() {
    super();
    this.state = {
      init: true,
      expanded: false,
      targetHeight: '5em'
    };
    this.handleReadMore = this.handleReadMore.bind(this);
  }

  getFullDescriptionHeight() {
    this._description.style.height = 'auto';
    const measuredHeight = this._description.offsetHeight;
    this._description.style.height = '5em';
    return measuredHeight + 'px';
  }

  handleReadMore() {
    if (!this.state.expanded) {
      this.setState({
        targetHeight: this.getFullDescriptionHeight()
      });
    }

    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    const resource = this.props.resource;
    const attr = resource.attributes;
    const moreLinkClass = classNames({
      'more-link': true,
      open: this.state.expanded
    });

    // Animation to open description
    const animation = {
      animation: {
        height: this.state.expanded ? this.state.targetHeight : '5em'
      },
      duration: 250,
      complete: () => {
        if (this.state.expanded) {
          this._description.style.height = 'auto';
        }
      }
    };

    return (
      <div className="slide-caption">
        <header>
          <h2 className="resource-title">
            {attr.title}
          </h2>
        </header>
        <VelocityComponent {...animation}>
          <div className="resource-description" ref={ (c) => {
            this._description = c;
          } }>
            <p>
              {attr.description}
            </p>
          </div>
        </VelocityComponent>
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
            <Link to={attr.attachmentUrl} target="_blank" className="download-link">
              {'Download'} <i className="manicon manicon-arrow-down"></i>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
