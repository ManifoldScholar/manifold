import { useTranslation, Trans } from "react-i18next";
import { Link } from "react-router";
import Form from "components/global/form";
import FormContainer from "components/global/form/Container";
import { entitlementTargetsAPI } from "api";

export default function EntitlementForm({ fetcher }) {
  const { t } = useTranslation();

  return (
    <section>
      <FormContainer.Form
        fetcher={fetcher}
        model={{ attributes: { scopedRoles: { readAccess: true } } }}
        doNotWarn
        className="form-secondary"
      >
        <Form.Picker
          label={t("entitlements.new.user_select_label")}
          listStyle={"well"}
          name="attributes[targetUrl]"
          options={entitlementTargetsAPI.index}
          optionToValue={et => et.id}
          optionToLabel={et => et.attributes.name}
          placeholder={t("entitlements.new.user_select_placeholder")}
          instructions={
            <Trans
              i18nKey="entitlements.instructions_user_groups"
              components={[<Link to="/backend/records/user-groups" />]}
            />
          }
          instructionsBelow
          predictive
        />
        {/* Date placeholder is not localized in first pass, since the api needs this format to parse the date. -LD */}
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
