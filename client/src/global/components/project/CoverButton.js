import React, { Component } from "react";
import PropTypes from "prop-types";
import startsWith from "lodash/startsWith";
import classNames from "classnames";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";
import Utility from "global/components/utility";

export default class CoverButton extends Component {
  static displayName = "Project.CoverButton";

  static propTypes = {
    selected: PropTypes.object,
    confirm: PropTypes.bool,
    addHandler: PropTypes.func.isRequired,
    removeHandler: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
    addText: PropTypes.string.isRequired,
    removeText: PropTypes.string.isRequired
  };

  static defaultProps = {
    addText: "Add",
    removeText: "Remove"
  };

  constructor(props) {
    super(props);
    this.state = {
      view: props.selected ? "remove" : "add"
    };
  }

  static getDerivedStateFromProps(props, state) {
    const view = props.selected ? "remove" : "add";
    if (startsWith(state.view, view)) return null;
    return { view };
  }

  setView(view) {
    this.setState(Object.assign({}, this.state, { view }));
  }

  handleAdd = () => {
    this.props.addHandler(this.props.project);
  };

  handleRemove = () => {
    this.props.removeHandler(this.props.selected);
  };

  maybeRemove = () => {
    if (this.props.confirm) return this.setView("remove-confirm-active");
    return this.handleRemove();
  };

  toggleFollow = event => {
    event.preventDefault();
    event.stopPropagation();
    if (this.props.selected) {
      this.handleRemove();
    } else {
      this.handleAdd();
    }
  };

  handleClick = event => {
    event.preventDefault();
    event.stopPropagation();

    switch (this.state.view) {
      case "add":
      case "add-active":
        return this.handleAdd();
      case "remove":
      case "remove-active":
        return this.maybeRemove();
      case "remove-confirm-active":
        return this.handleRemove();
      default:
        return null;
    }
  };

  screenReaderButtonText() {
    const { addText, removeText, project } = this.props;
    switch (this.state.view) {
      case "add":
      case "add-active":
        return `${addText} ${project.attributes.titlePlaintext}`;
      case "remove":
      case "remove-active":
        return `${removeText} ${project.attributes.titlePlaintext}`;
      default:
        return null;
    }
  }

  activate = () => {
    if (this.state.view === "add") {
      this.setView("add-active");
    } else if (this.state.view === "remove") {
      this.setView("remove-active");
    }
  };

  deactivate = () => {
    if (this.state.view === "add-active") {
      this.setView("add");
    } else if (this.state.view === "remove-confirm-active") {
      this.setView("remove");
    } else if (this.state.view === "remove-active") {
      this.setView("remove");
    }
  };

  renderButton(view) {
    switch (view) {
      case "add":
      case "add-active":
        return (
          <span key="add" className="action-text">
            {this.props.addText}
          </span>
        );
      case "remove":
      case "remove-active":
        return (
          <span
            key="remove"
            className="action-text action-text-hide-immediately"
          >
            {this.props.removeText}
          </span>
        );
      case "remove-confirm":
      case "remove-confirm-active":
        return (
          <span
            key="remove-confirm"
            className="action-text action-text-show-immediately"
          >
            Are You Sure?
          </span>
        );
      default:
        return null;
    }
  }

  render() {
    const wrapperClasses = classNames(
      this.state.view,
      "project-cover-button-wrapper"
    );

    return (
      <div>
        <button
          className="project-cover-button--sr-only screen-reader-text"
          onClick={this.toggleFollow}
        >
          {this.screenReaderButtonText()}
        </button>
        <button
          onClick={this.handleClick}
          onMouseEnter={this.activate}
          onMouseLeave={this.deactivate}
          className={wrapperClasses}
          aria-hidden="true"
          tabIndex={-1}
        >
          <div className="project-cover-button" aria-hidden="true">
            <div className="icons">
              <Utility.IconComposer
                icon="MinusUnique"
                size={28}
                iconClass="minus"
              />
              <Utility.IconComposer
                icon="CheckUnique"
                size={28}
                iconClass="check"
              />
              <Utility.IconComposer
                icon="PlusUnique"
                size={28}
                iconClass="plus"
              />
            </div>
            <ReactCSSTransitionGroup
              transitionName="button"
              transitionEnterTimeout={300}
              transitionLeaveTimeout={300}
            >
              {this.renderButton(this.state.view)}
            </ReactCSSTransitionGroup>
          </div>
        </button>
      </div>
    );
  }
}
