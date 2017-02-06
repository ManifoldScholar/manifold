import React, { PureComponent, PropTypes } from 'react';
import throttle from 'lodash/throttle';
import { Link } from 'react-router';
import classNames from 'classnames';
import Single from './Single';
import { Resource } from 'components/frontend';

export default class ResourceViewerSingle extends PureComponent {

  static displayName = "ResourceViewer.Single";

  static propTypes = {
    resources: PropTypes.array,
    location: PropTypes.number,
    height: PropTypes.number,
    highlightResourceId: PropTypes.string,
    fadeIn: PropTypes.bool
  };

  static defaultProps = {
    location: 0,
    fadeIn: true
  };

  constructor() {
    super();
    this.state = {
      visible: true
    };

    this.handleFade = this.handleFade.bind(this);
    this.throttledFade = throttle(this.handleFade, 200).bind(this);
  }

  componentDidMount() {
    if (this.props.fadeIn) {
      this.handleFade(event);
      window.addEventListener('scroll', this.throttledFade);
    }
  }

  componentWillUnmount() {
    if (this.props.fadeIn) {
      window.removeEventListener('scroll', this.throttledFade);
    }
  }

  handleFade(event) {
    const rect = this.group.getBoundingClientRect();
    this.setState({
      visible: rect.top > 120 && (rect.top + rect.height / 2) < window.innerHeight
    });
  }

  getHighlightedResource() {
    const highlighted = this.props.resources.filter((resource) => {
      return this.props.highlightResourceId === resource.id
    });

    return highlighted[0];
  }

  render() {
    const highlightedResource = this.getHighlightedResource();
    const groupClass = classNames({
      'resource-preview-group': true,
      'transition-out': this.props.fadeIn && !this.state.visible,
      'transition-in': this.props.fadeIn && this.state.visible
    });

    return(
      <div className={groupClass}
        style={{
          top: this.props.location + 'px',
          height: this.props.height + 'px'
        }}
        ref={(r) => { this.group = r; }}
      >
        <ul className="group-thumbnails">
          {this.props.resources.map((resource, index) => {

            return(
              <li key={index}>
                <Link to="#" title={resource.id}>
                  <Single
                    resource={resource}
                    fadeIn={false}
                  />
                </Link>
              </li>
            )
          })}
        </ul>
        <Link to="#" className="group-highlighted-resource" title={highlightedResource.id}>
          <Single
            resource={highlightedResource}
            fadeIn={false}
          />
        </Link>
      </div>
    );
  }
}
