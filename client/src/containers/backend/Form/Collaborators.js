import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";
import { makersAPI } from "api";
import { connect } from "react-redux";
import { entityStoreActions } from "actions";
import get from "lodash/get";

const { request, flush } = entityStoreActions;

export class FormCollaborators extends Component {
  static mapStateToProps = state => {
    return {
      updateCreators: get(state.entityStore.responses, "update-creators"),
      updateContributors: get(
        state.entityStore.responses,
        "update-contributors"
      ),
      createCreator: get(state.entityStore.responses, "create-creator"),
      createContributor: get(state.entityStore.responses, "create-contributor")
    };
  };

  static displayName = "Form.Collaborators";

  static propTypes = {
    entity: PropTypes.object,
    dispatch: PropTypes.func,
    api: PropTypes.object,
    history: PropTypes.object,
    route: PropTypes.object
  };

  componentWillUnmount() {
    this.props.dispatch(
      flush([
        "update-creators",
        "update-contributors",
        "create-creator",
        "create-contributor"
      ])
    );
  }

  updateMakers = (makers, changeType, key) => {
    const adjustedMakers = makers.map(e => {
      return {
        id: e.id,
        type: e.type
      };
    });
    const entity = {
      type: this.props.entity.type,
      id: this.props.entity.id,
      relationships: { [key]: { data: adjustedMakers } }
    };
    const call = this.props.api.update(entity.id, entity);
    const entityRequest = request(call, `update-${key}`);
    this.props.dispatch(entityRequest);
  };

  newMaker = (value, key) => {
    const maker = {
      type: "makers",
      attributes: {
        name: value
      }
    };
    const call = makersAPI.create(maker);
    const makerRequest = request(call, `create-${key}`);
    const { promise } = this.props.dispatch(makerRequest);
    return promise;
  };

  handleEditClick = collaborator => {
    const location = this.props.history.location.pathname;
    return this.props.history.push(`${location}/${collaborator.id}`);
  };

  render() {
    const entity = this.props.entity;

    return (
      <section>
        <form className="form-secondary">
          <Form.HasMany
            label="Authors"
            placeholder="Add an Author"
            onNew={value => {
              return this.newMaker(value, "creator");
            }}
            onChange={(makers, changeType) => {
              this.updateMakers(makers, changeType, "creators");
            }}
            optionsFetch={makersAPI.index}
            entities={entity.relationships.creators}
            entityBuilder={this.buildEntity}
            entityLabelAttribute="fullName"
            entityAvatarAttribute="avatarStyles"
            errors={get(this.props, "createCreator.errors")}
            editClickHandler={this.handleEditClick}
            orderable
          />
          <Form.HasMany
            label="Contributors"
            placeholder="Add a Contributor"
            onNew={value => {
              return this.newMaker(value, "contributor");
            }}
            onChange={(makers, changeType) => {
              this.updateMakers(makers, changeType, "contributors");
            }}
            optionsFetch={makersAPI.index}
            entities={entity.relationships.contributors}
            entityBuilder={this.buildEntity}
            entityLabelAttribute="fullName"
            entityAvatarAttribute="avatarStyles"
            errors={get(this.props, "createContributor.errors")}
            editClickHandler={this.handleEditClick}
            orderable
          />
        </form>
      </section>
    );
  }
}

export default connect(FormCollaborators.mapStateToProps)(FormCollaborators);
