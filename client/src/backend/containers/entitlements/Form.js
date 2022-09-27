import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
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
    entitlement: PropTypes.object,
    t: PropTypes.func
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
    const t = this.props.t;
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
          <Form.FieldGroup>
            <Form.Picker
              label={t("backend.forms.entitlement.user_select_label")}
              listStyle={"well"}
              name="attributes[targetUrl]"
              options={entitlementTargetsAPI.index}
              optionToValue={et => et.id}
              optionToLabel={et => et.attributes.name}
              placeholder={t(
                "backend.forms.entitlement.user_select_placeholder"
              )}
              predictive
            />
            {/* Date placholder is not localized in first pass, since the api needs this format to parse the date. -LD */}
            <Form.TextInput
              wide
              label={t("backend.forms.entitlement.expiration_label")}
              name="attributes[expiration]"
              placeholder="YYYY/MM/DD"
              instructions={t(
                "backend.forms.entitlement.expiration_instructions"
              )}
            />
          </Form.FieldGroup>
          <Form.Save text={t("backend.forms.entitlement.submit_label")} />
        </FormContainer.Form>
      </section>
    );
  }
}

export default withTranslation()(withRouter(EntitlementForm));
