import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { entitlementTargetsAPI, entitlementsAPI, requests } from "api";

export default function EntitlementForm({ entity, redirectAfterSuccess }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSuccess = () => {
    if (redirectAfterSuccess) {
      navigate(redirectAfterSuccess, { state: { keepNotifications: true } });
    }
  };

  const createEntitlement = entitlementData => {
    return entitlementsAPI.create(entity, entitlementData);
  };

  return (
    <section>
      <FormContainer.Form
        model={{ attributes: { scopedRoles: { readAccess: true } } }}
        doNotWarn
        name={requests.beProjectEntitlementCreate}
        options={{ refreshes: requests.beProjectEntitlements }}
        create={createEntitlement}
        onSuccess={handleSuccess}
        className="form-secondary"
        notificationScope="drawer"
      >
        <Form.Picker
          label={t("entitlements.new.user_select_label")}
          listStyle={"well"}
          name="attributes[targetUrl]"
          options={entitlementTargetsAPI.index}
          optionToValue={et => et.id}
          optionToLabel={et => et.attributes.name}
          placeholder={t("entitlements.new.user_select_placeholder")}
          predictive
        />
        {/* Date placholder is not localized in first pass, since the api needs this format to parse the date. -LD */}
        <Form.TextInput
          wide
          label={t("entitlements.new.expiration_label")}
          name="attributes[expiration]"
          placeholder="YYYY/MM/DD"
          instructions={t("entitlements.new.expiration_instructions")}
        />
        <Form.Save text={t("entitlements.new.submit_label")} />
      </FormContainer.Form>
    </section>
  );
}

EntitlementForm.displayName = "Entitlement.Form";
