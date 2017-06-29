import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Link } from 'react-router-dom';
import throttle from 'lodash/throttle';
import classNames from 'classnames';
import { Resource } from 'components/frontend';
import { Dialog } from 'components/backend';
import { connect } from 'react-redux';
import { uiReaderActions, entityStoreActions } from 'actions';
import { annotationsAPI, requests } from 'api';
import HigherOrder from 'containers/global/HigherOrder';

const { request, flush } = entityStoreActions;

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
    link: PropTypes.string,
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
      visible: true,
      confirmation: null
    };
    this.handleDestroy = this.handleDestroy.bind(this);
    this.handleFade = this.handleFade.bind(this);
    this.throttledFade = throttle(this.handleFade, 200).bind(this);
  }

  componentDidMount() {
    if (this.props.fadeIn) {
      this.handleFade();
      window.addEventListener('scroll', this.throttledFade);
    }
  }

  componentWillUnmount() {
    if (this.props.fadeIn) {
      window.removeEventListener('scroll', this.throttledFade);
    }
  }

  handleFade(event = null) {
    const rect = this.single.getBoundingClientRect();
    this.setState({
      visible: rect.top > 120 && (rect.top + rect.height / 2) < window.innerHeight
    });
  }

  closeDialog() {
    this.setState({ confirmation: null });
  }

  handleDestroy(event) {
    const heading = "Are you sure you want to remove this resource?";
    const message = "Pressing yes will remove the resource from this spot in the text. " +
      "It will not remove it from the project.";
    new Promise((resolve, reject) => {
      this.setState({
        confirmation: { resolve, reject, heading, message }
      });
    }).then(() => {
      this.doDestroy();
      this.closeDialog();
    }, () => { this.closeDialog(); });
  }

  doDestroy() {
    const call = annotationsAPI.destroy(this.props.annotationId);
    const options = { removes: { type: "annotations", id: this.props.annotationId } };
    const destroyRequest = request(call, requests.feResourceAnnotationDestroy, options);
    this.props.dispatch(destroyRequest);
  }

  setActiveAnnotation(annotationId) {
    this.props.dispatch(uiReaderActions.setActiveAnnotation(annotationId));
  }

  renderThumbnail() {
    const resource = this.props.resource;
    const variant = "smallLandscape";
    const hasImage = !!get(resource, `attributes.attachmentStyles['${variant}']`);
    const height = this.props.height ? this.props.height + 'px' : 'auto';

    return (
      <div
        className="resource-preview-overflow"
        style={{ maxHeight: height }}
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

  render() {
    const singleClass = classNames({
      'resource-preview-single': true,
      'transition-out': this.props.fadeIn && !this.state.visible,
      'transition-in': this.props.fadeIn && this.state.visible,
      highlighted: this.props.activeAnnotation === this.props.annotationId
    });

    // Setup link class here
    const linkClass = classNames({
      'resource-single-link': true,
      highlighted: this.props.activeAnnotation === this.props.annotationId
    });

    return (
      <div
        className={singleClass}
        style={{
          top: this.props.location + 'px'
        }}
      >
        {
          this.state.confirmation ?
            <Dialog.Confirm {...this.state.confirmation} />
            : null
        }
        <HigherOrder.RequireRole requiredRole="admin">
          <button onClick={this.handleDestroy} className="resource-delete">
            <i className="manicon manicon-x"></i>
          </button>
        </HigherOrder.RequireRole>
        {this.props.link ?
          <Link to={this.props.link} className={linkClass}>
            {this.renderThumbnail()}
          </Link> : this.renderThumbnail()
        }
      </div>
    );
  }
}

export default connect(
  ResourceViewerSingle.mapStateToProps
)(ResourceViewerSingle);
