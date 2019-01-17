import React, { PureComponent } from "react";
import Form from "backend/components/form";
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

  get collections() {
    return this.props.project.relationships.collections;
  }

  render() {
    return (
      <React.Fragment>
        <Form.Switch
          label="Show Collections?"
          name="attributes[showCollections]"
          focusOnMount
          wide
        />
        {this.includeCollections ? (
          <Form.HasMany
            label="Featured Collections"
            placeholder="Add a Collection"
            name="relationships[featuredCollections]"
            options={this.fetchCollections}
            entityLabelAttribute={"title"}
            wide
          />
        ) : null}
      </React.Fragment>
    );
  }
}
