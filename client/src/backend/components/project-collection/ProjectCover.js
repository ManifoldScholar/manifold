import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Project from "global/components/project";
import AddButton from "./AddButton";
import classNames from "classnames";

export default class ProjectCollectionProjectCover extends PureComponent {
  static displayName = "ProjectCollection.ProjectCover";

  static propTypes = {
    entity: PropTypes.object,
    selectedProjectIds: PropTypes.array,
    addHandler: PropTypes.func,
    removeHandler: PropTypes.func,
    addable: PropTypes.bool
  };

  renderAddButton(props) {
    if (!props.addable || !props.selectedProjectIds) return null;

    return (
      <AddButton
        selectedProjectIds={props.selectedProjectIds}
        project={props.entity}
        handleAdd={this.props.addHandler}
        handleRemove={this.props.removeHandler}
      />
    );
  }

  render() {
    const project = this.props.entity;

    const figureClass = classNames("cover", {
      "cover-placeholder": project.attributes.avatarStyles.small,
      dim: project.attributes.draft
    });

    return (
      <figure className={figureClass}>
        <Project.Avatar project={project} />
        {this.renderAddButton(this.props)}
      </figure>
    );
  }
}
