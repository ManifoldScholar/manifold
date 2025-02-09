import React from "react";
import Layout from "backend/components/layout";
import { useTranslation } from "react-i18next";
import HeadContent from "global/components/HeadContent";
import PageHeader from "backend/components/layout/PageHeader";
import Properties from "./Properties";

export default function NewUserWrapper() {
  const { t } = useTranslation();

  return (
    <div>
      <HeadContent
        title={`${t(`titles.users`)} | ${t("common.new")} | ${t(
          "common.admin"
        )}`}
        appendDefaultTitle
      />
      <PageHeader
        type="user"
        icon="Avatar24"
        title={t("records.users.new_header")}
        secondaryLinks={[
          {
            label: "titles.properties",
            route: "backendRecordsUserNew",
            entity: "user",
            ability: "update",
            args: ["new"]
          }
        ]}
      />
      <Layout.BackendPanel
        sidebar={
          <Layout.SecondaryNav
            links={[
              {
                label: "titles.properties",
                route: "backendRecordsUserNew",
                entity: "user",
                ability: "update",
                args: ["new"]
              }
            ]}
            panel
            ariaLabel={t("users.settings")}
          />
        }
      >
        <div>
          <Properties saveLabel={t("records.users.create_label")} />
        </div>
      </Layout.BackendPanel>
    </div>
  );
}

NewUserWrapper.displayName = "User.New";
