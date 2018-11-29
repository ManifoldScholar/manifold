import React, { Component } from "react";
import PropTypes from "prop-types";
import { Project } from "components/global";
import find from "lodash/find";

export default class ProjectCollectionAddButton extends Component {
  static displayName = "ProjectCollection.AddButton";

  static propTypes = {
    dispatch: PropTypes.func,
    projectCollection: PropTypes.object.isRequired,
    handleAdd: PropTypes.func.isRequired,
    handleRemove: PropTypes.func.isRequired,
    project: PropTypes.object
  };

  getIncluded(props) {
    const projects = props.projectCollection.relationships.projects;
    return find(projects, ["id", props.project.id]);
  }

  render() {
    return (
      <Project.CoverButton
        addText="Include"
        removeText="Exclude"
        selected={this.getIncluded(this.props)}
        addHandler={this.props.handleAdd}
        removeHandler={this.props.handleRemove}
        project={this.props.project}
      />
    );
  }
}
