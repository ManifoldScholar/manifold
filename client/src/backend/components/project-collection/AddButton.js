import React, { Component } from "react";
import PropTypes from "prop-types";
import Project from "global/components/project";

export default class ProjectCollectionAddButton extends Component {
  static displayName = "ProjectCollection.AddButton";

  static propTypes = {
    dispatch: PropTypes.func,
    collectionProjects: PropTypes.array,
    handleAdd: PropTypes.func.isRequired,
    handleRemove: PropTypes.func.isRequired,
    selectedProjectIds: PropTypes.array.isRequired,
    project: PropTypes.object
  };

  get selected() {
    return this.props.selectedProjectIds.includes(this.props.project.id);
  }

  render() {
    return (
      <Project.CoverButton
        addText="Include"
        removeText="Exclude"
        selected={this.selected}
        addHandler={this.props.handleAdd}
        removeHandler={this.props.handleRemove}
        project={this.props.project}
      />
    );
  }
}
