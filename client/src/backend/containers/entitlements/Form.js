import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { get, set, noop } from "lodash";

import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { entitlementTargetsAPI, entitlementsAPI, requests } from "api";
import connectAndFetch from "utils/connectAndFetch";
import lh from "helpers/linkHandler";
import EntityThumbnail from "global/components/entity-thumbnail";

export class EntitlementForm extends PureComponent {
  static displayName = "Entitlement.Form";

  static propTypes = {
    history: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired,
    entitlement: PropTypes.object,
    showUserInput: PropTypes.bool,
    dispatch: PropTypes.func
  };

  handleSuccess = (newEntitlement) => {
    const base = lh.nameFromType("backend", "Entitlements", this.props.entity);

    const url = lh.link(base, this.props.entity.id);

    return this.props.history.push(base, { keepNotifications: true });
  };

  composeCreateCall = (entitlement) => {
    const entity = this.props.entity;

    if (!entitlement || !entity) {
      return null;
    }

    const targetUrl = get(entitlement, "relationships.targetUrl.data.id");

    // this is an attribute, not a relationship
    set(entitlement, "attributes.targetUrl", targetUrl);

    // this should just be a hidden input but the hidden component does not work
    set(entitlement, "attributes.scopedRoles.readAccess", true);

    return entitlementsAPI.create(entity, entitlement);
  };

  labelTarget(target) {
    if (!target) {
      return null;
    }

    const targetType = get(target, "attributes.targetType", "Unknown");
    const name = get(target, "attributes.name", "unknown");

    return `${targetType}: ${name}`;
  }

  render() {
    const { entitlement } = this.props;

    return (
      <section>
        <FormContainer.Form
          model={entitlement}
          doNotWarn
          name={requests.beProjectEntitlementCreate}
          create={this.composeCreateCall}
          update={noop}
          options={{ adds: requests.beProjectEntitlements }}
          onSuccess={this.handleSuccess}
          className="form-secondary entitlements-form"
          notificationScope="drawer"
        >
          <Form.BelongsTo
            renderAttribute="name"
            fetch={entitlementTargetsAPI.index}
            fetchOptions={{}}
            inputLabel="Select Target"
            selectedLabel={this.labelTarget}
            relationName="targetUrl"
            focusOnMount={true}
            searchable={false}
          />
          <Form.TextInput
            wide
            label="Expiration"
            name="attributes[expiration]"
            placeholder="Buy Print Version"
            instructions="Enter YYYY/MM/DD or a human-readable string, e.g. 'in one year'"
          />
          <Form.Save text="Save Entitlement" />
        </FormContainer.Form>
      </section>
    );
  }
}

export default connectAndFetch(EntitlementForm);
