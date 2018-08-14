import React, { Component } from "react";
import PropTypes from "prop-types";
import { Category } from "components/backend";

export default class ProjectCategoryNewContainer extends Component {
  static displayName = "Project.Category.New";

  static propTypes = {
    project: PropTypes.object.isRequired,
    refresh: PropTypes.func,
    triggerClose: PropTypes.func
  };

  onSuccess = () => {
    this.props.refresh();
    if (this.props.triggerClose) this.props.triggerClose();
  };

  render() {
    return (
      <div>
        <header className="dialog-header-large">
          <h2 className="heading-quaternary">{"Create Category"}</h2>
        </header>
        <Category.Form
          projectId={this.props.project.id}
          onSuccess={this.onSuccess}
        />
      </div>
    );
  }
}
