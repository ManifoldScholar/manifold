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

  get addable() {
    return this.props.addable;
  }

  get project() {
    return this.props.entity;
  }

  get selectedProjectIds() {
    return this.props.selectedProjectIds;
  }

  get selected() {
    return this.selectedProjectIds.includes(this.project.id);
  }

  renderAddButton() {
    if (!this.addable || !this.selectedProjectIds) return null;

    return (
      <AddButton
        selected={this.selected}
        project={this.project}
        handleAdd={this.props.addHandler}
        handleRemove={this.props.removeHandler}
      />
    );
  }

  render() {
    const figureClass = classNames("cover", {
      "cover-placeholder": this.project.attributes.avatarStyles.small,
      dim: this.project.attributes.draft
    });

    return (
      <figure className={figureClass}>
        <Project.Avatar project={this.project} />
        {this.renderAddButton()}
      </figure>
    );
  }
}
