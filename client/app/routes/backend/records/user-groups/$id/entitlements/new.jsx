import { useTranslation } from "react-i18next";
import { useFetcher, useOutletContext } from "react-router";
import { journalsAPI, projectsAPI, userGroupEntitlementsAPI } from "api";
import formAction from "lib/react-router/helpers/formAction";
import Layout from "components/backend/layout";
import Form from "components/global/form";
import FormContainer from "components/global/form/Container";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data, params }) =>
    userGroupEntitlementsAPI.create({ data, userGroupId: params.id }),
  redirectTo: ({ params }) =>
    `/backend/records/user-groups/${params.id}/entitlements`
});

export default function UserGroupEntitlementNew() {
  const { t } = useTranslation();
  const { userGroup } = useOutletContext();
  const fetcher = useFetcher();

  const cancelUrl = `/backend/records/user-groups/${userGroup.id}/entitlements`;

  return (
    <section>
      <Layout.DrawerHeader
        title={t("records.user_groups.entitlements.add_header")}
        instructions={t("records.user_groups.entitlements.add_instructions")}
      />
      <FormContainer.Form
        fetcher={fetcher}
        className="form-secondary"
        notificationScope="drawer"
      >
        {getValue => {
          const type = getValue("entityType");
          const options =
            type === "journal" ? journalsAPI.index : projectsAPI.index;
          return (
            <>
              <Form.Select
                label={t("entitlements.pending.type_label")}
                instructions={t("entitlements.pending.type_instructions")}
                name="entityType"
                options={[
                  {
                    label: t("glossary.project_title_case_one"),
                    value: "project"
                  },
                  {
                    label: t("glossary.journal_title_case_one"),
                    value: "journal"
                  }
                ]}
                value="project"
              />
              <Form.Picker
                name="attributes[targetUrl]"
                label={
                  type ? t(`glossary.${type}_one`) : t("glossary.project_one")
                }
                options={options}
                optionToLabel={entity => entity.attributes.titlePlaintext}
                optionToValue={entity =>
                  entity.attributes.entitlementSubjectUrl
                }
                listStyle="rows"
              />
              <Form.DrawerButtons
                showCancel
                cancelUrl={cancelUrl}
                submitLabel="entitlements.new.submit_label"
              />
            </>
          );
        }}
      </FormContainer.Form>
    </section>
  );
}
