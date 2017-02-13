import React, { Component, PropTypes } from 'react';
import { Form, Text } from 'components/backend';
import { makersAPI } from 'api';
import { connect } from 'react-redux';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import get from 'lodash/get';

const { request, flush, requests } = entityStoreActions;

class FormCollaborators extends Component {

  static displayName = "Form.Collaborators";

  static mapStateToProps(state) {
    return {
      updateCreators: get(state.entityStore.responses, 'update-creators'),
      updateContributors: get(state.entityStore.responses, 'update-contributors'),
      createCreator: get(state.entityStore.responses, 'create-creator'),
      createContributor: get(state.entityStore.responses, 'create-contributor')
    };
  }

  static propTypes = {
    entity: PropTypes.object,
    dispatch: PropTypes.func,
    api: PropTypes.object
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
    const entity = {
      type: this.props.entity.type,
      id: this.props.entity.id,
      relationships: { [key]: { data: makers } }
    };
    const call = this.props.api.update(entity.id, entity);
    const entityRequest = request(call, `update-${key}`);
    this.props.dispatch(entityRequest);
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
    const entity = this.props.entity;

    return (
      <section>
        <section>
          <form className="form-secondary">
            <Form.HasMany
              label="Authors"
              placeholder="Add an Author"
              onNew={(value) => { return this.newMaker(value, "creator"); }}
              onChange={(makers, changeType) => {
                this.updateMakers(makers, changeType, "creators");
              }}
              optionsFetch={makersAPI.index}
              entities={entity.relationships.creators}
              entityBuilder={this.buildEntity}
              entityLabelAttribute="fullName"
              entityAvatarAttribute="avatarUrl"
              errors={get(this.props, 'createCreator.errors')}
              orderable
            />
            <Form.HasMany
              label="Contributors"
              placeholder="Add a Contributor"
              onNew={(value) => { return this.newMaker(value, "contributor"); }}
              onChange={(makers, changeType) => {
                this.updateMakers(makers, changeType, "contributors");
              }}
              optionsFetch={makersAPI.index}
              entities={entity.relationships.contributors}
              entityLabelAttribute="fullName"
              entityAvatarAttribute="avatarUrl"
              errors={get(this.props, 'createContributor.errors')}
              orderable
            />
          </form>
        </section>
      </section>
    );
  }
}

export default connect(
  FormCollaborators.mapStateToProps
)(FormCollaborators);

