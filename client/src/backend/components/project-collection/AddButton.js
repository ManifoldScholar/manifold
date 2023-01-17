import React, { Component } from "react";
import PropTypes from "prop-types";
import startsWith from "lodash/startsWith";
import classNames from "classnames";
import {
  TransitionGroup as ReactTransitionGroup,
  CSSTransition
} from "react-transition-group";
import IconComposer from "global/components/utility/IconComposer";
import { withTranslation } from "react-i18next";

class ProjectCollectionAddButton extends Component {
  static displayName = "ProjectCollection.AddButton";

  static propTypes = {
    dispatch: PropTypes.func,
    collectionProjects: PropTypes.array,
    handleAdd: PropTypes.func.isRequired,
    handleRemove: PropTypes.func.isRequired,
    selected: PropTypes.bool,
    project: PropTypes.object.isRequired,
    t: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      view: this.selected ? "remove" : "add"
    };
  }

  static getDerivedStateFromProps(props, state) {
    const view = props.selected ? "remove" : "add";
    if (startsWith(state.view, view)) return null;
    return { view };
  }

  get transitionProps() {
    return {
      mountOnEnter: true,
      timeout: 600,
      classNames: "collecting-toggle__text"
    };
  }

  get selected() {
    return this.props.selected;
  }

  setView(view) {
    this.setState({ ...this.state, view });
  }

  handleAdd = () => {
    this.props.handleAdd(this.props.project);
  };

  handleRemove = () => {
    this.props.handleRemove(this.props.project);
  };

  toggleInclude = event => {
    event.preventDefault();
    event.stopPropagation();
    if (this.selected) {
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
        return this.handleRemove();
      default:
        return null;
    }
  };

  screenReaderButtonText() {
    const { project } = this.props;
    const t = this.props.t;
    switch (this.state.view) {
      case "add":
      case "add-active":
        return t("project_collections.include_title", {
          title: project.attributes.titlePlaintext
        });
      case "remove":
      case "remove-active":
        return t("project_collections.exclude_title", {
          title: project.attributes.titlePlaintext
        });
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
    } else if (this.state.view === "remove-active") {
      this.setView("remove");
    }
  };

  determineText() {
    const t = this.props.t;
    switch (this.state.view) {
      case "remove-active":
        return {
          key: "add",
          text: t("project_collections.exclude")
        };
      case "add-active":
        return {
          key: "remove",
          text: t("project_collections.include")
        };
      default:
        return {
          key: "empty",
          text: ""
        };
    }
  }

  renderButtonGroup() {
    const { key, text } = this.determineText();

    return (
      <ReactTransitionGroup>
        <CSSTransition key={key} {...this.transitionProps}>
          <span className="collecting-toggle__text">{text}</span>
        </CSSTransition>
      </ReactTransitionGroup>
    );
  }

  render() {
    return (
      <>
        <button
          className="sr-collecting-toggle screen-reader-text"
          onClick={this.toggleInclude}
        >
          {this.screenReaderButtonText()}
        </button>
        <button
          onClick={this.handleClick}
          onMouseEnter={this.activate}
          onMouseLeave={this.deactivate}
          className={classNames({
            "collecting-toggle": true,
            "collecting-toggle--small-project-cover": true
          })}
          aria-hidden="true"
          tabIndex={-1}
        >
          <div
            className={classNames({
              "collecting-toggle__inner": true,
              [`collecting-toggle__inner--${this.state.view}`]: true
            })}
            aria-hidden="true"
          >
            <div className="collecting-toggle__icons">
              <IconComposer
                icon="MinusUnique"
                size={28}
                className="collecting-toggle__icon collecting-toggle__icon--remove"
              />
              <IconComposer
                icon="CheckUnique"
                size={28}
                className="collecting-toggle__icon collecting-toggle__icon--confirm"
              />
              <IconComposer
                icon="PlusUnique"
                size={28}
                className="collecting-toggle__icon collecting-toggle__icon--add"
              />
            </div>
            {this.renderButtonGroup()}
          </div>
        </button>
      </>
    );
  }
}

export default withTranslation()(ProjectCollectionAddButton);
