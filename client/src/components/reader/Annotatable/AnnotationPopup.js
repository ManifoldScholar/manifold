import React, { Component, PropTypes } from 'react';
import { throttle } from 'lodash';
import classNames from 'classnames';

export default class AnnotationPopup extends Component {

  static propTypes = {
    selection: PropTypes.object,
    share: PropTypes.func,
    highlight: PropTypes.func,
    annotate: PropTypes.func
  };

  constructor() {
    super();
    this.state = {
      visible: false,
      top: 0,
      left: 0
    };
  }

  componentDidMount() {
    window.addEventListener('resize', throttle(() => {
      this.positionPopup(this.props.selection);
    }, 400));
  }

  componentWillReceiveProps(nextProps) {
    this.maybeShowPopup(this.props, nextProps);
  }

  hasSelection(selection) {
    if (!selection) return false;
    if (selection && selection.range) {
      return true;
    }
  }

  maybeShowPopup(prevProps, nextProps) {
    if (nextProps && prevProps !== nextProps) {
      // Update popup
      if (!nextProps.selection) {
        // Hide the popup if there is no "Range"
        this.setState({ visible: false });
      } else {
        // Calculate the position for the popup
        this.positionPopup(nextProps.selection);

        // Otherwise show the popup and set it's (new) position
        this.setState({ visible: true });
      }
    }
  }

  positionPopup(selection) {
    if (this.hasSelection(selection)) {
      const rect = selection.range.getBoundingClientRect();
      const popupHeight = this.refs.popup.offsetHeight;
      const popupWidth = this.refs.popup.offsetWidth;
      let left = rect.left;
      if (rect.left + popupWidth > document.body.clientWidth) {
        left = document.body.clientWidth - popupWidth - 15;
      }
      const top = window.pageYOffset + rect.top - popupHeight;
      this.setState(Object.assign(this.state, { top, left }));
    }
  }

  render() {

    const popupClass = classNames({
      'annotation-popup': true,
      visible: this.state.visible
    });

    return (
      <div className={popupClass}
        ref="popup"
        style={{
          top: this.state.top,
          left: this.state.left
        }}
      >
        <button onClick={this.props.annotate}>
          Annotate
        </button>
        <button onClick={this.props.highlight}>
          Highlight
        </button>
        <button onClick={this.props.share}>
          Share
        </button>
        <div className="tail"></div>
      </div>
    );
  }
}
