import React, { Component, PropTypes } from 'react';
import { Form, Text } from 'components/backend';
import { makersAPI, projectsAPI } from 'api';
import { connect } from 'react-redux';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import get from 'lodash/get';

const { request, flush, requests } = entityStoreActions;

class ProjectDetailCollaborators extends Component {

  static displayName = "ProjectDetail.Collaborators";

  static mapStateToProps(state) {
    return {
      updateCreators: get(state.entityStore.responses, 'update-creators'),
      updateContributors: get(state.entityStore.responses, 'update-contributors'),
      createCreator: get(state.entityStore.responses, 'create-creator'),
      createContributor: get(state.entityStore.responses, 'create-contributor')
    };
  }

  static propTypes = {
    project: PropTypes.object,
    dispatch: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.updateMakers = this.updateMakers.bind(this);
    this.newMaker = this.newMaker.bind(this);
  }

  componentWillUnmount() {
    this.props.dispatch(flush([
      'update-creators', 'update-contributors', 'create-creator', 'create-contributor'
    ]));
  }

  updateMakers(makers, changeType, key) {
    const project = {
      type: "projects",
      id: this.props.project.id,
      relationships: { [key]: { data: makers } }
    };
    const call = projectsAPI.update(project.id, project);
    const projectRequest = request(call, `update-${key}`);
    this.props.dispatch(projectRequest);
  }

  newMaker(value, key) {
    const parts = value.split(' ');
    const maker = {
      type: "makers",
      attributes: {
        firstName: parts[0],
        lastName: parts[1]
      }
    };
    const call = makersAPI.create(maker);
    const makerRequest = request(call, `create-${key}`);
    const { promise } = this.props.dispatch(makerRequest);
    return promise;
  }

  mapInputToEntity(value) {
    const parts = value.split(' ');
    return {
      type: "makers",
      attributes: {
        firstName: parts[0],
        lastName: parts[1]
      }
    };
  }

  render() {
    const project = this.props.project;

    return (
      <section>
        <section>
          <form className="form-secondary">
            <Form.HasMany
              label="Creators"
              onNew={(value) => { return this.newMaker(value, "creator"); }}
              onChange={(makers, changeType) => {
                this.updateMakers(makers, changeType, "creators");
              }}
              optionsFetch={makersAPI.index}
              entities={project.relationships.creators}
              entityBuilder={this.buildEntity}
              entityLabelAttribute="fullName"
              entityAvatarAttribute="avatarUrl"
              errors={get(this.props, 'createCreator.errors')}
            />
            <Form.HasMany
              label="Contributors"
              onNew={(value) => { return this.newMaker(value, "contributor"); }}
              onChange={(makers, changeType) => {
                this.updateMakers(makers, changeType, "contributors");
              }}
              optionsFetch={makersAPI.index}
              entities={project.relationships.contributors}
              entityLabelAttribute="fullName"
              entityAvatarAttribute="avatarUrl"
              errors={get(this.props, 'createContributor.errors')}
            />
          </form>
        </section>
      </section>
    );
  }
}

export default connect(
  ProjectDetailCollaborators.mapStateToProps
)(ProjectDetailCollaborators);

