import React, { Component, PropTypes } from 'react';
import { throttle } from 'lodash';
import classNames from 'classnames';

export default class AnnotationPopup extends Component {

  static propTypes = {
    selection: PropTypes.object,
    share: PropTypes.func,
    highlight: PropTypes.func,
    annotate: PropTypes.func,
    attachResource: PropTypes.func,
    bookmark: PropTypes.func
  };

  constructor() {
    super();
    this.state = {
      visible: false,
      top: 0,
      left: 0,
      direction: 'up'
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
      let direction = 'up';
      let left = rect.left;
      if (rect.left + popupWidth > document.body.clientWidth) {
        left = document.body.clientWidth - popupWidth - 15;
      }
      // Check if popup needs to be positioned from the top or the bottom
      let top = 0;
      // Check if the top of the popup might collide with the top of the window
      if ((window.pageYOffset + rect.top - popupHeight) > document.body.scrollTop + 100) {
        top = window.pageYOffset + rect.top - popupHeight;
        direction = 'up';
      } else {
        // Position the popup from below
        top = window.pageYOffset + rect.top + 80;
        direction = 'down';
      }
      this.setState(Object.assign(this.state, { top, left, direction }));
    }
  }

  render() {

    const popupClass = classNames({
      'annotation-popup': true,
      visible: this.state.visible
    });

    const tailClass = classNames({
      tail: true,
      'tail-down': this.state.direction === 'up',
      'tail-up': this.state.direction === 'down',
    });

    return (
      <div className={popupClass}
        ref="popup"
        style={{
          top: this.state.top,
          left: this.state.left
        }}
      >
        {/* Provisional button for creating resources */}
        <button onClick={this.props.attachResource}>
          <i className="manicon manicon-cube-shine"></i>
          Resource
        </button>
        <button onClick={this.props.highlight}>
          <i className="manicon manicon-pencil-simple"></i>
          Highlight
        </button>
        <button onClick={this.props.annotate}>
          <i className="manicon manicon-word-bubble"></i>
          Annotate
        </button>
        <button onClick={this.props.bookmark}>
          <i className="manicon manicon-bookmark-outline"></i>
          Bookmark
        </button>
        <button onClick={this.props.share}>
          <i className="manicon manicon-nodes"></i>
          Share
        </button>
        <div className={tailClass}></div>
      </div>
    );
  }
}
