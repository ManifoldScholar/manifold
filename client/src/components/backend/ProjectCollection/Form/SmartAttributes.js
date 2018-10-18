import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";
import { subjectsAPI } from "api";
import FormContext from "helpers/contexts/FormContext";

export default class SmartAttributes extends Component {
  static displayName = "ProjectCollection.Form.SmartAttributes";

  static propTypes = {
    projectCollection: PropTypes.object
  };

  render() {
    return (
      <FormContext.Consumer>
        {formProps => {
          if (!formProps.getModelValue("attributes[smart]")) return null;

          return (
            <React.Fragment>
              <Form.NumberInput
                label="Projects Visible:"
                name="attributes[numberOfProjects]"
                instructions="Number of projects shown in this Collection."
              />
              <Form.Switch
                className="form-toggle-secondary"
                label="Featured Projects:"
                name="attributes[featuredOnly]"
                instructions="Include only featured projects in this Collection."
              />
              <Form.HasMany
                label="Subjects"
                placeholder="Add a Subject"
                instructions="Include all Projects with these subjects."
                entityLabelAttribute="name"
                name="relationships[subjects]"
                fetch={subjectsAPI.index}
              />
              <Form.TagList
                name="attributes[tagList]"
                placeholder="Add a Tag"
                label="Tags"
              />
            </React.Fragment>
          );
        }}
      </FormContext.Consumer>
    );
  }
}
