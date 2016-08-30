import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class AnnotationPopup extends Component {

  static propTypes = {
    mouseDownEvent: PropTypes.object,
    mouseUpEvent: PropTypes.object,
    selection: PropTypes.object
  };

  constructor() {
    super();
    this.state = {
      visible: false,
      top: 0,
      left: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    this.maybeShowPopup(this.props, nextProps);
  }

  maybeShowPopup(prevProps, nextProps) {
    if (nextProps && prevProps !== nextProps) {
      // Update popup
      if (nextProps.selection.type !== "Range") {
        // Hide the popup if there is no "Range"
        this.setState({ visible: false });
      } else {
        // Calculate the position for the popup
        const range = nextProps.selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const popupHeight = this.refs.popup.offsetHeight;
        this.setState({ top: window.pageYOffset + rect.top - popupHeight });
        this.setState({ left: range.getBoundingClientRect().left });

        // Otherwise show the popup and set it's (new) position
        this.setState({ visible: true });
      }
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
        <button>
          Annotate
        </button>
        <button>
          Highlight
        </button>
        <button>
          Share
        </button>
        <div className="tail"></div>
      </div>
    );
  }
}
