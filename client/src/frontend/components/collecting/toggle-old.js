import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
  TransitionGroup as ReactTransitionGroup,
  CSSTransition
} from "react-transition-group";
import IconComposer from "global/components/utility/IconComposer";

export default class CollectingToggle extends Component {
  static displayName = "Collecting.Toggle";

  static propTypes = {
    collectable: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      view: props.selected ? "remove" : "add"
    };
  }

  get transitionProps() {
    return {
      mountOnEnter: true,
      classNames: "collect-toggle__text",
      timeout: { enter: 0, exit: 200 }
    };
  }

  setView(view) {
    this.setState({ ...this.state, view });
  }

  handleAdd = () => {
    this.props.onAdd();
  };

  handleRemove = () => {
    this.props.onRemove();
  };

  maybeRemove = () => {
    this.setView("remove-confirm-active");
  };

  toggleFollow = () => {
    if (this.props.selected) {
      this.handleRemove();
    } else {
      this.handleAdd();
    }
  };

  handleClick = () => {
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

  screenReaderText() {
    const { srAddMessage, srRemoveMessage } = this.props;
    switch (this.state.view) {
      case "add":
      case "add-active":
        return srAddMessage;
      case "remove":
      case "remove-active":
        return srRemoveMessage;
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

  renderRemove() {
    return (
      <CSSTransition key="remove" {...this.transitionProps}>
        <span className="collect-toggle__text">{this.props.removeText}</span>
      </CSSTransition>
    );
  }

  renderRemoveConfirm() {
    return (
      <CSSTransition key="remove-confirm" {...this.transitionProps}>
        <span className="collect-toggle__text">Are You Sure?</span>
      </CSSTransition>
    );
  }

  renderAdd() {
    return (
      <CSSTransition key="add" {...this.transitionProps}>
        <span className="collect-toggle__text">{this.props.addText}</span>
      </CSSTransition>
    );
  }

  renderEmpty() {
    return (
      <CSSTransition key="empty" {...this.transitionProps}>
        <span className="collect-toggle__text" />
      </CSSTransition>
    );
  }

  renderButtonText() {
    const { view } = this.state;
    const showRemove = view === "remove-active";
    const showRemoveConfirm =
      view === "remove-confirm" || view === "remove-confirm-active";
    const showAdd = view === "add-active";
    const showEmpty = view === "add" || view === "remove";
    return (
      <ReactTransitionGroup>
        {showRemove && this.renderRemove()}
        {showRemoveConfirm && this.renderRemoveConfirm()}
        {showAdd && this.renderAdd()}
        {showEmpty && this.renderEmpty()}
      </ReactTransitionGroup>
    );
  }

  render() {
    return (
      <div>
        <button
          className="collect-toggle collect-toggle--sr-only screen-reader-text"
          onClick={this.toggleFollow}
        >
          {this.screenReaderText()}
        </button>
        <button
          onClick={this.handleClick}
          onMouseEnter={this.activate}
          onMouseLeave={this.deactivate}
          className={classNames({
            "collect-toggle": true,
            "collect-toggle--project-cover": true,
            [`collect-toggle--${this.state.view}`]: true
          })}
          aria-hidden="true"
          tabIndex={-1}
        >
          <div
            className={classNames({
              "collect-toggle__inner": true,
              [`collect-toggle__inner--${this.state.view}`]: true
            })}
            aria-hidden="true"
          >
            <div className="collect-toggle__icons">
              <IconComposer
                icon="MinusUnique"
                size={28}
                iconClass="collect-toggle__icon collect-toggle__icon--remove"
              />
              <IconComposer
                icon="CheckUnique"
                size={28}
                iconClass="collect-toggle__icon collect-toggle__icon--confirm"
              />
              <IconComposer
                icon="StarFillUnique"
                size="default"
                iconClass="collect-toggle__icon collect-toggle__icon--add"
              />
            </div>
            {this.renderButtonText()}
          </div>
        </button>
      </div>
    );
  }
}
