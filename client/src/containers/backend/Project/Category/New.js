import React, { Component } from "react";
import PropTypes from "prop-types";
import { Category } from "components/backend";
import lh from "helpers/linkHandler";

export default class ProjectCategoryNewContainer extends Component {
  static displayName = "Project.Category.New";

  static propTypes = {
    project: PropTypes.object.isRequired,
    refresh: PropTypes.func,
    history: PropTypes.object
  };

  onSuccess = category => {
    this.props.refresh();
    const url = lh.link(
      "backendProjectCategory",
      this.props.project.id,
      category.id
    );
    this.props.history.push(url, { keepNotifications: true });
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
