import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Project as FrontendProject } from "components/frontend";
import AddButton from "./AddButton";
import classNames from "classnames";

export default class ProjectCollectionProjectCover extends PureComponent {
  static displayName = "ProjectCollection.ProjectCover";

  static propTypes = {
    entity: PropTypes.object,
    projectCollection: PropTypes.object,
    addHandler: PropTypes.func,
    removeHandler: PropTypes.func,
    addable: PropTypes.bool
  };

  renderAddButton(props) {
    if (!props.addable || !props.projectCollection) return null;

    return (
      <AddButton
        projectCollection={props.projectCollection}
        project={props.entity}
        handleAdd={this.props.addHandler}
        handleRemove={this.props.removeHandler}
      />
    );
  }

  renderProjectMakers(makers) {
    let output = null;
    if (makers && makers.length > 0) {
      output = (
        <div className="relations-list">
          {makers.map((maker, i) => {
            let nameList = maker.attributes.fullName;
            if (i > 0) nameList = ", " + nameList;
            return nameList;
          })}
        </div>
      );
    }

    return output;
  }

  render() {
    const project = this.props.entity;

    const figureClass = classNames("cover", {
      "cover-placeholder": project.attributes.avatarStyles.small,
      dim: project.attributes.draft
    });

    return (
      <div className="item-wrapper">
        <figure className={figureClass}>
          <FrontendProject.Cover project={project} />
          {this.renderAddButton(this.props)}
        </figure>
        <div className="meta">
          <h3 className="name">
            <span
              className="title-text"
              dangerouslySetInnerHTML={{
                __html: project.attributes.titleFormatted
              }}
            />
          </h3>
          {this.renderProjectMakers(project.relationships.creators)}
        </div>
      </div>
    );
  }
}
