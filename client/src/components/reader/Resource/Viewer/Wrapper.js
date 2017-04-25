import React, { PureComponent, PropTypes } from 'react';
import throttle from 'lodash/throttle';
import { Resource } from 'components/reader';

export default class ResourceViewerWrapper extends PureComponent {

  static displayName = "ResourceViewer.Wrapper";

  static propTypes = {
    resources: PropTypes.array,
    annotations: PropTypes.array,
    bodySelector: PropTypes.string,
    containerSize: PropTypes.number,
    sectionId: PropTypes.string,
    textId: PropTypes.string,
  };

  constructor() {
    super();
    this.state = {
      markers: []
    };
    this.resourceMarkers = this.resourceMarkers.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.propsChanged(this.props, nextProps)) this.updateMarkers(nextProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) return true;
    return this.propsChanged(this.props, nextProps);
  }

  propsChanged(props, nextProps) {
    const compare = Object.keys(ResourceViewerWrapper.propTypes);
    const changed = compare.find((k) => {
      return props[k] !== nextProps[k];
    });
    return changed !== undefined;
  }

  componentDidMount() {
    this.updateMarkers(this.props);
    this.height = this.bodyNodeHeight();
    this.timer = setInterval(() => {
      this.updateIfHeightChanged();
    }, 500);
  }

  componentWillUnmount() {
    window.clearInterval(this.timer);
  }

  updateIfHeightChanged() {
    const height = this.bodyNodeHeight();
    if (height === this.height) return;
    this.height = height;
    this.updateMarkers(this.props);
  }

  updateMarkers(props) {
    const markers = this.resourceMarkers(props);
    this.setState({ markers });
  }

  bodyNodeHeight() {
    const body = this.bodyNode();
    return body.offsetHeight;
  }

  bodyNode() {
    return document.querySelector(this.props.bodySelector);
  }

  resourceMarkers(props) {
    const markers = [];
    const body = this.bodyNode();
    const markerNodes = body.querySelectorAll('[data-annotation-resource]');
    [...markerNodes].forEach((markerNode) => {
      const annotationId = markerNode.getAttribute('data-annotation-resource');
      const annotation = props.annotations.find((a) => a.id === annotationId);
      if (annotation) {
        const resourceId = annotation.attributes.resourceId;
        const rect = markerNode.getBoundingClientRect();
        markers.push({
          annotationId,
          resourceId,
          rect: {
            top: rect.top + document.body.scrollTop
          }
        });
      }
    });
    return markers;
  }

  render() {
    if (!this.props.resources) return null;
    return (
      <Resource.Viewer.List
        textId={this.props.textId}
        sectionId={this.props.sectionId}
        resources={this.props.resources}
        containerSize={this.props.containerSize}
        resourceMarkers={this.state.markers}
      />
    );
  }
}
