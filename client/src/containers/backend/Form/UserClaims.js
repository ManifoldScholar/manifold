import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Text } from 'components/backend';
import { makersAPI, usersAPI } from 'api';
import { connect } from 'react-redux';
import { entityStoreActions } from 'actions';

export class FormUserClaims extends Component {

  static displayName = "Form.UserClaims";

  static propTypes = {
    entity: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onNew: PropTypes.func,
    dispatch: PropTypes.func,
    errors: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.setKeys = this.setKeys.bind(this);
  }

  setKeys(entity) {
    if (!entity) return null;
    let out = {};
    if (entity.type === "users") {
      out = {
        entityKey: "maker",
        api: makersAPI,
        entities: entity.relationships.makers
      };
    } else {
      out = {
        entityKey: "user",
        api: usersAPI,
        entities: entity.relationships.users
      };
    }
    return out;
  }

  render() {
    const entity = this.props.entity;
    const keys = this.setKeys(entity);

    return (
      <Form.HasMany
        label={this.props.label}
        labelHeader
        placeholder={this.props.placeholder}
        onNew={this.props.onNew ? (value) => { return this.props.onNew(value); } : null}
        onChange={(entities, changeType) => {
          this.props.onChange(entities, changeType);
        }}
        optionsFetch={keys.api.index}
        entities={keys.entities}
        entityBuilder={this.buildEntity}
        entityLabelAttribute="fullName"
        entityAvatarAttribute="avatarStyles"
        errors={this.props.errors}
      />
    );
  }
}

export default connect(
  FormUserClaims.mapStateToProps
)(FormUserClaims);

