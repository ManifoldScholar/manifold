import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { uiReaderActions } from 'actions';
import { browserHistory } from 'react-router';
import { linkHelpers as lh } from 'routes';

class ResourceMarker extends Component {

  static mapStateToProps(state, ownProps) {
    const newState = {
      activeAnnotation: state.ui.reader.activeAnnotation
    };
    return Object.assign({}, newState, ownProps);
  }

  static propTypes = {
    annotations: PropTypes.array,
    handleClick: PropTypes.func,
    dispatch: PropTypes.func,
    activeAnnotation: PropTypes.string
  };

  setActiveAnnotation(annotationId) {
    this.props.dispatch(uiReaderActions.setActiveAnnotation(annotationId));
  }

  handleClick(event, annotation) {
    event.preventDefault();
    const base = window.location.pathname;
    const rel = lh.frontendProjectResourceRelative(annotation.resourceId);
    const url = `${base}/${rel}`;
    browserHistory.push(url);
  }

  render() {
    return (
      <span>
        {this.props.annotations.map((annotation, index) => {
          const id = annotation.id;
          const markerClassNames = classnames({
            'resource-marker': true,
            active: id === this.props.activeAnnotation
          });
          return (
            <span
              key={index}
              title={id}
              data-annotation-resource={id}
              className={markerClassNames}
              onClick={(event) => { this.handleClick(event, annotation); }}
              onMouseOver={() => { this.setActiveAnnotation(id); }}
              onMouseLeave={() => { this.setActiveAnnotation(null); }}
            >
              <i
                className="manicon resource-cube-fill"
              >&nbsp;&nbsp;&nbsp;&nbsp;</i>
            </span>
          );
        })}
      </span>
    );
  }
}

export default connect(
  ResourceMarker.mapStateToProps
)(ResourceMarker);
