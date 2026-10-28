import React, { Component } from "react";
import PropTypes from "prop-types";
import startsWith from "lodash/startsWith";
import { withTranslation } from "react-i18next";
import * as ToggleStyles from "frontend/components/collecting/Toggle/styles";
import * as Styled from "./styles";

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

    return <ToggleStyles.Text key={key}>{text}</ToggleStyles.Text>;
  }

  render() {
    return (
      <>
        <Styled.ScreenReaderToggle onClick={this.toggleInclude}>
          {this.screenReaderButtonText()}
        </Styled.ScreenReaderToggle>
        <ToggleStyles.Toggle
          onClick={this.handleClick}
          onMouseEnter={this.activate}
          onMouseLeave={this.deactivate}
          $variant="small-project-cover"
          aria-hidden="true"
          tabIndex={-1}
        >
          <ToggleStyles.Inner $view={this.state.view} aria-hidden="true">
            <ToggleStyles.Icons>
              {/*
                The plain `collecting-toggle__icon` class on each icon is a
                hook for the `svg:not(.collecting-toggle__icon)` selectors in
                theme/styles/components/backend/listEntity/entityRow.js. It
                is not a styling class.
              */}
              <ToggleStyles.Icon
                icon="MinusUnique"
                size={28}
                $type="remove"
                className="collecting-toggle__icon"
              />
              <ToggleStyles.Icon
                icon="CheckUnique"
                size={28}
                $type="confirm"
                className="collecting-toggle__icon"
              />
              <ToggleStyles.Icon
                icon="PlusUnique"
                size={28}
                $type="add"
                className="collecting-toggle__icon"
              />
            </ToggleStyles.Icons>
            {this.renderButtonGroup()}
          </ToggleStyles.Inner>
        </ToggleStyles.Toggle>
      </>
    );
  }
}

export default withTranslation()(ProjectCollectionAddButton);
