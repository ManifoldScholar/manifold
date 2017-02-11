import React, { PureComponent, PropTypes } from 'react';
import get from 'lodash/get';
import throttle from 'lodash/throttle';
import classNames from 'classnames';
import { Resource } from 'components/frontend';
import { connect } from 'react-redux';
import { uiReaderActions } from 'actions';

class ResourceViewerSingle extends PureComponent {

  static displayName = "ResourceViewer.Single";

  static mapStateToProps(state, ownProps) {
    const newState = {
      activeAnnotation: state.ui.reader.activeAnnotation
    };
    return Object.assign({}, newState, ownProps);
  }

  static propTypes = {
    resource: PropTypes.object,
    annotationId: PropTypes.string,
    location: PropTypes.number,
    height: PropTypes.number,
    active: PropTypes.bool,
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
    const rect = this.single.getBoundingClientRect();
    this.setState({
      visible: rect.top > 120 && (rect.top + rect.height / 2) < window.innerHeight
    });
  }

  setActiveAnnotation(annotationId) {
    this.props.dispatch(uiReaderActions.setActiveAnnotation(annotationId));
  }

  render() {
    const resource = this.props.resource;
    const variant = "smallLandscape";
    const hasImage = !!get(resource, `attributes.attachmentThumbnails['${variant}']`);
    const height = this.props.height ? this.props.height + 'px' : 'auto';
    const singleClass = classNames({
      'resource-preview-single': true,
      'transition-out': this.props.fadeIn && !this.state.visible,
      'transition-in': this.props.fadeIn && this.state.visible,
      highlighted: this.props.activeAnnotation === this.props.annotationId
    });

    return (
      <div
        className={singleClass}
        style={{
          top: this.props.location + 'px',
          maxHeight: height
        }}
        ref={(r) => { this.single = r; }}
        onMouseOver={() => { this.setActiveAnnotation(this.props.annotationId); }}
        onMouseLeave={() => { this.setActiveAnnotation(null); }}
      >
        <Resource.Thumbnail
          key={resource.id}
          resource={resource}
          noCrop={hasImage}
          showTitle
          showKind={false}
          variant={variant}
          additionalClasses="minimal right"
        />
      </div>
    );
  }
}

export default connect(
  ResourceViewerSingle.mapStateToProps
)(ResourceViewerSingle);
