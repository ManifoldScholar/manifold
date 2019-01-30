import React, { Component } from "react";
import PropTypes from "prop-types";
import Category from "backend/components/category";
import lh from "helpers/linkHandler";
import Navigation from "backend/components/navigation";

export default class ProjectCategoryNewContainer extends Component {
  static displayName = "Project.Category.New";

  static propTypes = {
    project: PropTypes.object.isRequired,
    refresh: PropTypes.func,
    history: PropTypes.object
  };

  onSuccess = categoryIgnored => {
    this.props.refresh();
    const url = lh.link("backendProjectTexts", this.props.project.id);
    this.props.history.push(url, { keepNotifications: false });
  };

  render() {
    return (
      <div>
        <Navigation.DrawerHeader title="Create Category" />
        <Category.Form
          projectId={this.props.project.id}
          onSuccess={this.onSuccess}
        />
      </div>
    );
  }
}
