import React, { Component } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import { subjectsAPI, tagsAPI } from "api";
import FormContext from "helpers/contexts/FormContext";
import isString from "lodash/isString";

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
            <>
              <Form.NumberInput
                label="Number of Projects:"
                name="attributes[numberOfProjects]"
                instructions="Number of projects included in this Collection."
              />
              <Form.Switch
                className="form-toggle-secondary"
                label="Featured Projects:"
                name="attributes[featuredOnly]"
                instructions="Include only featured projects in this Collection."
              />
              <Form.Picker
                label="Show projects with these subjects"
                listStyle={"well"}
                name="relationships[subjects]"
                options={subjectsAPI.index}
                optionToLabel={subject => subject.attributes.name}
                placeholder="Select a Subject"
                predictive
                listRowComponent="SubjectRow"
              />
              <Form.Picker
                label="Show projects with these tags"
                listStyle={"well"}
                listRowComponent="StringRow"
                name="attributes[tagList]"
                placeholder="Enter Tags"
                options={tagsAPI.index}
                optionToLabel={tag => tag.attributes.name}
                optionToValue={tag => tag.attributes.name}
                beforeSetValue={tags =>
                  Array.isArray(tags) ? tags.join(",") : tags
                }
                beforeGetValue={tags =>
                  isString(tags) ? tags.split(",") : tags
                }
                allowNew
                predictive
              />
            </>
          );
        }}
      </FormContext.Consumer>
    );
  }
}
