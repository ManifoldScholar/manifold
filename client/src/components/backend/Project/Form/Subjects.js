import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";
import { projectsAPI, subjectsAPI } from "api";
import { connect } from "react-redux";
import { entityStoreActions } from "actions";
import get from "lodash/get";
import Authorization from "helpers/authorization";

const { request, flush } = entityStoreActions;

export class ProjectSubjects extends PureComponent {
  static mapStateToProps = state => {
    return {
      createSubject: get(state.entityStore.responses, "create-subject"),
      updateSubjects: get(state.entityStore.responses, "update-subjects"),
      authentication: state.authentication
    };
  };

  static displayName = "Project.Form.Subjects";

  static propTypes = {
    project: PropTypes.object,
    dispatch: PropTypes.func,
    authentication: PropTypes.object,
    wide: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.authorization = new Authorization();
  }

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

  maybeHandleNew() {
    const canCreate = this.authorization.authorizeAbility({
      authentication: this.props.authentication,
      entity: "subject",
      ability: "create"
    });
    if (!canCreate) return null;
    return this.newSubject;
  }

  render() {
    const project = this.props.project;

    return (
      <Form.HasMany
        label="Subjects"
        placeholder="Add a Subject"
        onNew={this.maybeHandleNew()}
        changeHandler={subjects => {
          this.updateSubjects(subjects);
        }}
        optionsFetch={subjectsAPI.index}
        entities={project.relationships.subjects}
        entityBuilder={this.buildEntity}
        entityLabelAttribute="name"
        errors={get(this.props, "createSubjects.errors")}
        wide
      />
    );
  }
}

export default connect(ProjectSubjects.mapStateToProps)(ProjectSubjects);
