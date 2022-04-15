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
                label={t("backend.forms.project_collection.number_projects")}
                name="attributes[numberOfProjects]"
                instructions={t(
                  "backend.forms.project_collection.number_projects_instructions"
                )}
              />
              <Form.Switch
                className="form-toggle-secondary"
                label={t("backend.forms.project_collection.featured_projects")}
                name="attributes[featuredOnly]"
                instructions={t(
                  "backend.forms.project_collection.featured_projects_instructions"
                )}
              />
              <Form.Picker
                label={t("backend.forms.project_collection.subjects")}
                listStyle={"well"}
                name="relationships[subjects]"
                options={subjectsAPI.index}
                optionToLabel={subject => subject.attributes.name}
                placeholder={t(
                  "backend.forms.project_collection.subjects_placeholder"
                )}
                predictive
                listRowComponent="SubjectRow"
              />
              <Form.Picker
                label={t("backend.forms.project_collection.tags")}
                listStyle="well"
                listRowComponent="StringRow"
                name="attributes[tagList]"
                placeholder={t(
                  "backend.forms.project_collection.tags_placeholder"
                )}
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
