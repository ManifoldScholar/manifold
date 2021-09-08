import React, { Component } from "react";
import PropTypes from "prop-types";
import { UID } from "react-uid";
import Preview from "./Types";
import { CSSTransition } from "react-transition-group";
import GlobalOverlay from "global/components/Overlay";
import has from "lodash/has";
import capitalize from "lodash/capitalize";

export default class ResourcePreview extends Component {
  static canPreview = resource => {
    return ResourcePreview.getPreviewableComponent(resource) !== null;
  };

  static displayName = "Resource.Preview";

  static propTypes = {
    resource: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.state = {
      overlayOpen: false
    };
  }

  componentDidMount() {
    window.addEventListener("keyup", this.handleEscape);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleEscape);
  }

  static getPreviewableComponent = resource => {
    let component = null;
    const kind = resource.attributes.kind;
    const key = capitalize(kind);
    if (has(Preview, key)) {
      component = Preview[key];
    }
    return component;
  };

  getPreviewComponent(resource) {
    return ResourcePreview.getPreviewableComponent(resource);
  }

  handleEscape = event => {
    if (event.keyCode === 27) {
      this.closeOverlay(event);
    }
  };

  handleOpenPreviewClick = event => {
    event.stopPropagation();
    this.setState({ overlayOpen: true });
  };

  closeOverlay = eventIgnored => {
    this.setState({ overlayOpen: false });
  };

  renderChildren = () => {
    let firstChild = false;
    if (React.Children.count(this.props.children) > 1) {
      firstChild = this.props.children[0];
    } else {
      firstChild = this.props.children;
    }
    return React.cloneElement(firstChild);
  };

  render() {
    const PreviewComponent = this.getPreviewComponent(this.props.resource);

    if (!PreviewComponent) return this.renderChildren(this.props.resource);

    return (
      <UID>
        {id => (
          <>
            <CSSTransition
              in={this.state.overlayOpen}
              classNames="overlay-full"
              timeout={{ enter: 300, exit: 300 }}
              unmountOnExit
            >
              <GlobalOverlay
                appearance="overlay-full bg-neutral90"
                closeCallback={this.closeOverlay}
                id={id}
              >
                <PreviewComponent resource={this.props.resource} />
              </GlobalOverlay>
            </CSSTransition>
            <button
              className="resource-preview-wrapper"
              onClick={this.handleOpenPreviewClick}
              aria-controls={id}
              aria-expanded={this.state.overlayOpen}
            >
              {this.renderChildren()}
            </button>
          </>
        )}
      </UID>
    );
  }
}
