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

  componentDidUpdate(prevProps) {
    // Update available resource markers if we have new props or state
    if (prevProps.annotations !== this.props.annotations) {
      this.updateAvailableResourceMarkers();
    }
  }

  updateAvailableResourceMarkers() {
    if (!this.props.body) return;
    const markerNodes = this.props.body.querySelectorAll('[data-resources]');
    let markers = [];
    [...markerNodes].forEach((markerNode) => {
      markers = markers.concat(
        markerNode.getAttribute('data-resources').split(',').map((id) => {
          const rect = markerNode.getBoundingClientRect();
          return {
            id,
            rect: {
              top: rect.top + document.body.scrollTop,
            },
          }
        })
      );
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
