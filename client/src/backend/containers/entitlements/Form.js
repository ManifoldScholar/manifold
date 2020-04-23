import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { entitlementTargetsAPI, entitlementsAPI, requests } from "api";
import { withRouter } from "react-router-dom";

export class EntitlementForm extends PureComponent {
  static displayName = "Entitlement.Form";

  static propTypes = {
    entity: PropTypes.object.isRequired,
    history: PropTypes.object,
    redirectAfterSuccess: PropTypes.string,
    entitlement: PropTypes.object
  };

  handleSuccess = () => {
    if (this.props.redirectAfterSuccess && this.props.history) {
      return this.props.history.push(this.props.redirectAfterSuccess, {
        keepNotifications: true
      });
    }
  };

  composeCreateCall = entitlement => {
    const entity = this.props.entity;
    return entitlementsAPI.create(entity, entitlement);
  };

  render() {
    return (
      <section>
        <FormContainer.Form
          model={{ attributes: { scopedRoles: { readAccess: true } } }}
          doNotWarn
          name={requests.beProjectEntitlementCreate}
          options={{ refreshes: requests.beProjectEntitlements }}
          create={this.composeCreateCall}
          onSuccess={this.handleSuccess}
          className="form-secondary"
          notificationScope="drawer"
        >
          <Form.Picker
            label="Who is the Entitlement For?"
            listStyle={"well"}
            name="attributes[targetUrl]"
            options={entitlementTargetsAPI.index}
            optionToValue={et => et.id}
            optionToLabel={et => et.attributes.name}
            placeholder="Select a User or Reading Group"
            predictive
          />
          <Form.TextInput
            wide
            label="Expiration"
            name="attributes[expiration]"
            placeholder="YYYY/MM/DD"
            instructions="Enter YYYY/MM/DD or a human-readable string, e.g. 'in one year'"
          />
          <Form.Save text="Save Entitlement" />
        </FormContainer.Form>
      </section>
    );
  }
}

export default withRouter(EntitlementForm);
