import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Layout from "backend/components/layout";
import { FormContext } from "helpers/contexts";
import Form, { Unwrapped } from "global/components/form";
import Utility from "global/components/utility";
import { useApiCallback, useFetch } from "hooks";
import { usersAPI, permissionsAPI } from "api";
import withConfirmation from "hoc/withConfirmation";

function JournalPermissions({ journal, confirm }) {
  const { t } = useTranslation();

  const { data } = useFetch({ request: [permissionsAPI.index, journal] });

  const [editors, setEditors] = useState([]);
  const [permissions, setPermissions] = useState(data);

  useEffect(() => {
    if (data) {
      setEditors(data.map(p => p.relationships?.user));
      setPermissions(
        data.map(p => ({ id: p.id, userId: p.relationships?.user?.id }))
      );
    }
  }, [data]);

  const createPermission = useApiCallback(permissionsAPI.create);
  const deletePermission = useApiCallback(permissionsAPI.destroy);

  const handleCreate = async val => {
    const user = [...val].pop();
    const permission = {
      relationships: { user: { data: { id: user.id, type: "users" } } },
      attributes: { roleNames: ["journal_editor"] }
    };
    const { data: res, errors } = await createPermission(journal, permission);

    if (!errors) {
      setEditors(val);
      setPermissions([
        ...permissions,
        { id: res.id, userId: res.relationships?.user?.data?.id }
      ]);
    }
  };

  const doDelete = async id => {
    const permission = permissions.find(p => p.userId === id);

    try {
      await deletePermission(journal, permission.id);
      const update = editors.filter(e => e.id !== id);
      setEditors(update);
      setPermissions(permissions.filter(p => p.userId === id));
    } catch (e) {
      // eslint-disable-next-line
      console.debug(e);
    }
  };

  const handleDelete = id => {
    const heading = t("modals.remove_journal_editor");
    confirm(heading, null, () => doDelete(id));
  };

  return (
    <Layout.BackendPanel flush>
      <FormContext.Provider value={{ styleType: "secondary" }}>
        <Form.SectionLabel label={t("journals.permissions.header")} />
        <Form.Instructions
          instructions={t("journals.permissions.instructions")}
        />
        <Unwrapped.Picker
          name=""
          listStyle="rows"
          options={() => usersAPI.index({ order: "first_name, last_name" })}
          optionToLabel={u => u.attributes.fullName}
          placeholder={t("projects.permissions.user_placeholder")}
          predictive
          isMultiple
          listRowComponent="UserRow"
          listRowProps={{
            hideLabels: true,
            rowClickMode: "none",
            utilityOverride: id => (
              <button
                className="entity-row__utility-button"
                onClick={() => handleDelete(id)}
                title={t("actions.delete")}
              >
                <Utility.IconComposer icon="delete32" size={26} />
              </button>
            )
          }}
          set={handleCreate}
          value={editors}
        />
      </FormContext.Provider>
    </Layout.BackendPanel>
  );
}

export default withConfirmation(JournalPermissions);

JournalPermissions.displayName = "Journal.Access.Wrapper";

JournalPermissions.propTypes = {
  journal: PropTypes.object,
  confirm: PropTypes.func
};
