import React, { Component, PropTypes } from 'react';
import { throttle } from 'lodash';
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

    this.setHighlight = this.setHighlight.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', throttle(() => {
      this.positionPopup(this.props.selection);
    }, 400));
  }

  componentWillReceiveProps(nextProps) {
    this.maybeShowPopup(this.props, nextProps);
  }

  getBlockParent(element) {
    if (element.nodeType === 1) {
      const t = document.createElement(element.tagName);
      document.body.appendChild(t);
      const tStyle = window.getComputedStyle(t, '');
      if (tStyle.display === 'block') {
        return element;
      }
    }

    return this.getBlockParent(element.parentNode);
  }

  setHighlight() {
    const selection = this.props.selection;
    // If the selection is all within the same node
    console.log(selection, 'selection');
    for (let i = 0; i < selection.rangeCount; i++) {
      const range = (selection.getRangeAt(i));
      // Set attributes on the start container and end container of the range
      // before they are extracted in order to determine if there is a partial selection
      const startNode = this.getBlockParent(range.startContainer.parentNode);
      const endNode = this.getBlockParent(range.endContainer.parentNode);
      startNode.setAttribute('range-start', 'true');
      endNode.setAttribute('range-end', 'true');
      console.log(range, 'range');
      const contents = range.extractContents();
      console.log(contents, 'contents');
      if (contents.children.length === 0) {
        // Simple text node range, wrap in highlight selector and insert
        const highlightWrapper = document.createElement('span');
        highlightWrapper.className = 'annotation-underline primary';
        highlightWrapper.appendChild(contents);
        range.insertNode(highlightWrapper);
      } else {
        // Wrap non-block children in appropriate class
        // Range contains a document fragment
        // Iterate children in reverse so they are re-added in the
        // correct order
        Array.from(contents.children).reverse().forEach((child) => {
          this.wrapTextChildren(child, 'annotation-underline primary');
          range.insertNode(child);
          const prev = child.previousSibling;
          const next = child.nextSibling;
          if (child.getAttribute('range-start') && prev.getAttribute('range-start')) {
            prev.innerHTML = prev.innerHTML + child.innerHTML;
            prev.parentNode.removeChild(child);
            prev.removeAttribute('range-start');
          }

          if (child.getAttribute('range-end') && next.getAttribute('range-end')) {
            next.innerHTML = child.innerHTML + next.innerHTML;
            next.parentNode.removeChild(child);
            next.removeAttribute('range-end');
          }
        });
      }
    }
  }

  wrapTextChildren(element, wrapperClass) {
    if (element.nodeType === 3) {
      const wrapper = document.createElement('span');
      wrapper.className = wrapperClass;
      element.parentNode.appendChild(wrapper);
      wrapper.appendChild(element);
      console.log(element, 'this element should be wrapped');
      return false;
    }

    for (let i = 0; i < element.childNodes.length; i++) {
      this.wrapTextChildren(element.childNodes[i], wrapperClass);
    }
  }

  maybeShowPopup(prevProps, nextProps) {
    if (nextProps && prevProps !== nextProps) {
      // Update popup
      if (nextProps.selection.type !== "Range") {
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
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const popupHeight = this.refs.popup.offsetHeight;
    const popupWidth = this.refs.popup.offsetWidth;

    let leftPos = rect.left;
    if (rect.left + popupWidth > document.body.clientWidth) {
      leftPos = document.body.clientWidth - popupWidth - 15;
    }
    this.setState({ top: window.pageYOffset + rect.top - popupHeight });
    this.setState({ left: leftPos });
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
        <button onClick={this.setHighlight}>
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
