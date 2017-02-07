import React, { PureComponent, PropTypes } from 'react';
import Viewer from './Viewer';
import throttle from 'lodash/throttle';

export default class ResourceViewerWrapper extends PureComponent {

  static displayName = "ResourceViewer.Wrapper";

  static propTypes = {
    resources: PropTypes.array,
    containerSize: PropTypes.number,
    currentResources: PropTypes.array,
    body: PropTypes.object
  };

  constructor() {
    super();
    this.state = {
      availableResourceMarkers: []
    };

    this.updateAvailableResourceMarkers = this.updateAvailableResourceMarkers.bind(this);
  }

  componentDidMount() {
    // Run once on mount ?
    this.updateAvailableResourceMarkers();
  }

  componentWillReceiveProps(nextProps) {
    if (
      (this.props.annotations !== nextProps.annotations) ||
      (this.props.resources !== nextProps.resources) ||
      (this.props.containerSize !== nextProps.containerSize)
    ) {
      this.updateAvailableResourceMarkers();
    }
  }

  updateAvailableResourceMarkers() {
    if (!this.props.body) return;
    const markerNodes = this.props.body.querySelectorAll('[data-resource]');
    const markers = [];
    [...markerNodes].forEach((markerNode) => {
      const id = markerNode.getAttribute('data-resource');
      const rect = markerNode.getBoundingClientRect();
      markers.push({
        id,
        rect: {
          top: rect.top + document.body.scrollTop
        }
      });
    });

    this.setState({
      availableResourceMarkers: markers
    });
  }

  render() {
    return (
      <Viewer
        resources={this.props.resources}
        resourceMarkers={this.state.availableResourceMarkers}
        containerSize={this.props.containerSize}
      />
    );
  }
}
