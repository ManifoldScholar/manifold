import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import Layout from "components/backend/layout";
import { FormContext } from "contexts";
import Form from "components/global/form";
import Dialog from "components/global/dialog";
import { usersAPI } from "api";
import { useConfirmation } from "hooks";

export default function JournalPermissions({ permissions }) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const { confirm, confirmation } = useConfirmation();

  const fetchUsers = useCallback(
    () => usersAPI.index({ order: "first_name, last_name" }),
    []
  );

  const editors = (permissions ?? []).map(p => p.relationships?.user);
  const permissionMap = (permissions ?? []).map(p => ({
    id: p.id,
    userId: p.relationships?.user?.id
  }));

  const handleCreate = val => {
    const user = [...val].pop();
    const permission = {
      relationships: { user: { data: { id: user.id, type: "users" } } },
      attributes: { roleNames: ["journal_editor"] }
    };

    fetcher.submit(
      { intent: "createPermission", permission },
      { method: "POST", encType: "application/json" }
    );
  };

  const handleDelete = id => {
    const heading = t("modals.remove_journal_editor");
    const message = t("modals.remove_journal_editor_body");

    confirm({
      heading,
      message,
      callback: closeDialog => {
        const permission = permissionMap.find(p => p.userId === id);
        fetcher.submit(
          { intent: "deletePermission", permissionId: permission.id },
          { method: "POST", encType: "application/json" }
        );
        closeDialog();
      }
    });
  };

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <Layout.BackendPanel flush>
        <FormContext.Provider value={{ styleType: "secondary" }}>
          <Form.SectionLabel label={t("journals.permissions.header")} />
          <Form.Instructions
            instructions={t("journals.permissions.instructions")}
          />
          <Form.Picker
            listStyle="rows"
            options={fetchUsers}
            optionToLabel={u => u.attributes.fullName}
            placeholder={t("projects.permissions.user_placeholder")}
            predictive
            isMultiple
            listRowComponent="JournalEditorRow"
            listRowProps={{ handleDelete }}
            onChange={handleCreate}
            value={editors}
          />
        </FormContext.Provider>
      </Layout.BackendPanel>
    </>
  );
}

JournalPermissions.displayName = "Journal.Permissions";
