import React, { Component } from "react";
import PropTypes from "prop-types";
import { projectsAPI, makersAPI } from "api";
import { connect } from "react-redux";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import Authorize from "hoc/authorize";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;

export class ProjectCollaboratorsContainer extends Component {
  static displayName = "Project.Collaborators";

  static propTypes = {
    project: PropTypes.object,
    history: PropTypes.object.isRequired,
    refresh: PropTypes.func.isRequired,
    route: PropTypes.object
  };

  closeUrl(props) {
    return lh.link("backendProjectCollaborators", props.project.id);
  }

  close = () => {
    this.props.refresh();
    this.props.history.push(this.closeUrl(this.props));
  };

  newMaker = value => {
    const maker = {
      type: "maker",
      attributes: {
        name: value
      }
    };
    const call = makersAPI.create(maker);
    const makerRequest = request(call, `create-maker`);
    const { promise } = this.props.dispatch(makerRequest);
    return promise.then(({ data }) => data);
  };

  render() {
    const project = this.props.project;
    const closeUrl = this.closeUrl(this.props);

    return (
      <Authorize
        entity={project}
        ability="updateMakers"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <section>
          <FormContainer.Form
            debug
            style={{ marginBottom: 100 }}
            model={project}
            name="update-project-collaborators"
            update={projectsAPI.update}
            className="form-secondary"
          >
            <Form.Picker
              label="Authors"
              name="relationships[creators]"
              optionToLabel={maker => maker.attributes.fullName}
              reorderable
              predictive
              listStyle={"rows"}
              listRowComponent="MakerRow"
              listRowEditRoute={"backendRecordsMaker"}
              options={makersAPI.index}
              newToValue={this.newMaker}
              allowNew
            />
            <Form.Picker
              label="Contributors"
              name="relationships[contributors]"
              optionToLabel={maker => maker.attributes.fullName}
              callbacks={{}}
              reorderable
              predictive
              newToValue={this.newMaker}
              allowNew
              options={makersAPI.index}
              listStyle={"rows"}
              listRowComponent="MakerRow"
              listRowEditRoute={"backendRecordsMaker"}
            />
            <Form.Save />
          </FormContainer.Form>
          {childRoutes(this.props.route, {
            drawer: true,
            drawerProps: { closeUrl },
            childProps: { afterDestroy: this.close }
          })}
        </section>
      </Authorize>
    );
  }
}

export default connect(ProjectCollaboratorsContainer.mapStateToProps)(
  ProjectCollaboratorsContainer
);
