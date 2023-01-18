import React, { Component } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import { subjectsAPI, tagsAPI } from "api";
import FormContext from "helpers/contexts/FormContext";
import { withTranslation } from "react-i18next";

class SmartAttributes extends Component {
  static displayName = "ProjectCollection.Form.SmartAttributes";

  static propTypes = {
    projectCollection: PropTypes.object,
    t: PropTypes.func
  };

  render() {
    const t = this.props.t;
    return (
      <FormContext.Consumer>
        {formProps => {
          if (!formProps.getModelValue("attributes[smart]")) return null;

          return (
            <>
              <Form.NumberInput
                label={t("project_collections.number_projects")}
                name="attributes[numberOfProjects]"
                instructions={t(
                  "project_collections.number_projects_instructions"
                )}
              />
              <Form.Switch
                label={t("project_collections.featured_projects")}
                name="attributes[featuredOnly]"
                instructions={t(
                  "project_collections.featured_projects_instructions"
                )}
              />
              <Form.Picker
                label={t("project_collections.subjects")}
                listStyle={"well"}
                name="relationships[subjects]"
                options={subjectsAPI.index}
                optionToLabel={subject => subject.attributes.name}
                placeholder={t("project_collections.subjects_placeholder")}
                predictive
                listRowComponent="SubjectRow"
              />
              <Form.Picker
                label={t("project_collections.tags")}
                listStyle="well"
                listRowComponent="StringRow"
                name="attributes[tagList]"
                placeholder={t("project_collections.tags_placeholder")}
                options={tagsAPI.index}
                optionToLabel={tag => tag.attributes.name}
                optionToValue={tag => tag.attributes.name}
                allowNew
              />
            </>
          );
        }}
      </FormContext.Consumer>
    );
  }
}

export default withTranslation()(SmartAttributes);
