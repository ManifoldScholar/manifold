import React, { PureComponent } from "react";
import Form from "backend/components/form";
import { projectsAPI } from "api";
import PropTypes from "prop-types";

export default class ProjectContentTypeFormResources extends PureComponent {
  static displayName = "Project.Content.TypeForm.Types.Resources";

  static propTypes = {
    project: PropTypes.object.isRequired,
    getModelValue: PropTypes.func.isRequired
  };

  get includeCollections() {
    return this.props.getModelValue("attributes[showCollections]");
  }

  get project() {
    return this.props.project;
  }

  fetchCollections = () => {
    return projectsAPI.collections(this.project.id);
  };

  render() {
    return (
      <React.Fragment>
        <Form.Switch
          label="Show Collections?"
          name="attributes[showCollections]"
          wide
        />
        {this.includeCollections ? (
          <Form.HasMany
            label="Featured Collections"
            placeholder="Add a Collection"
            name="relationships[featuredCollections]"
            fetch={this.fetchCollections}
            entityLabelAttribute={"title"}
            searchable={false}
            wide
          />
        ) : null}
      </React.Fragment>
    );
  }
}
