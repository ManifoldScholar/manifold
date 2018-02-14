import React, { Component } from "react";
import PropTypes from "prop-types";
import Preview from ".";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";
import { Overlay as GlobalOverlay } from "components/global";
import has from "lodash/has";
import capitalize from "lodash/capitalize";

export default class ResourcePreview extends Component {
  static displayName = "Resource.Preview";

  static propTypes = {
    resource: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired
  };

  static getPreviewableComponent = resource => {
    let component = null;
    const kind = resource.attributes.kind;
    const key = capitalize(kind);
    if (has(Preview, key)) {
      component = Preview[key];
    }
    return component;
  };

  static canPreview = resource => {
    return ResourcePreview.getPreviewableComponent(resource) !== null;
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
    const linkWrapperClass = "resource-link-wrapper";

    if (!PreviewComponent)
      return (
        <div className={linkWrapperClass}>
          {this.renderChildren(this.props.resource)}
        </div>
      );

    return (
      <div className={linkWrapperClass}>
        <ReactCSSTransitionGroup
          transitionName={"overlay-full"}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {this.state.overlayOpen ? (
            <GlobalOverlay
              appearance="overlay-full bg-neutral90"
              closeCallback={this.closeOverlay}
            >
              <PreviewComponent resource={this.props.resource} />
            </GlobalOverlay>
          ) : null}
        </ReactCSSTransitionGroup>
        <div
          className="resource-preview-wrapper"
          onClick={this.handleOpenPreviewClick}
        >
          {this.renderChildren()}
        </div>
      </div>
    );
  }
}
