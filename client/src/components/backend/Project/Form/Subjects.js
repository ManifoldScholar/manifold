import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";
import { projectsAPI, subjectsAPI } from "api";
import { connect } from "react-redux";
import { entityStoreActions } from "actions";
import get from "lodash/get";

const { request, flush } = entityStoreActions;

export class ProjectSubjects extends PureComponent {
  static displayName = "Project.Form.Subjects";

  static mapStateToProps = state => {
    return {
      createSubject: get(state.entityStore.responses, "create-subject"),
      updateSubjects: get(state.entityStore.responses, "update-subjects")
    };
  };

  static propTypes = {
    project: PropTypes.object,
    dispatch: PropTypes.func
  };

  componentWillUnmount() {
    this.props.dispatch(flush(["update-subjects", "create-subject"]));
  }

  newSubject = value => {
    const subject = {
      type: "subject",
      attributes: {
        name: value
      }
    };
    const call = subjectsAPI.create(subject);
    const subjectRequest = request(call, `create-subject`);
    const { promise } = this.props.dispatch(subjectRequest);
    return promise;
  };

  updateSubjects = subjects => {
    const adjustedSubjects = subjects.map(subject => {
      return {
        id: subject.id,
        type: "subjects"
      };
    });
    const entity = {
      type: "projects",
      id: this.props.project.id,
      relationships: { subjects: { data: adjustedSubjects } }
    };
    const call = projectsAPI.update(entity.id, entity);
    const entityRequest = request(call, `update-subjects`);
    this.props.dispatch(entityRequest);
  };

  render() {
    const project = this.props.project;

    return (
      <Form.HasMany
        label="Subjects"
        placeholder="Add a Subject"
        onNew={value => {
          return this.newSubject(value);
        }}
        onChange={subjects => {
          this.updateSubjects(subjects);
        }}
        optionsFetch={subjectsAPI.index}
        entities={project.relationships.subjects}
        entityBuilder={this.buildEntity}
        entityLabelAttribute="name"
        errors={get(this.props, "createSubjects.errors")}
      />
    );
  }
}

export default connect(ProjectSubjects.mapStateToProps)(ProjectSubjects);
