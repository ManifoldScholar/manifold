import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FormContext } from "helpers/contexts";
import Form, { Unwrapped } from "global/components/form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { makersAPI, collaboratorsAPI } from "api";
import { useApiCallback } from "hooks";
import capitalize from "lodash/capitalize";

export default function AddCollaboratorForm({
  entityId,
  entityType,
  closeUrl,
  refresh
}) {
  const { t } = useTranslation();
  const history = useHistory();

  const [makerId, setMakerId] = useState("");
  const [roles, setRoles] = useState([]);

  const fetchRoles = useApiCallback(collaboratorsAPI.roles);

  const [roleOptions, setRoleOptions] = useState(null);

  /* eslint-disable react-hooks/exhaustive-deps */
  /* Only need to fetch this once on mount. */
  useEffect(() => {
    const getRoleOptions = async () => {
      const res = await fetchRoles();
      setRoleOptions(res.data);
    };

    if (!roleOptions) {
      getRoleOptions();
    }
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const createCollaborator = useApiCallback(collaboratorsAPI.create);

  const onSubmit = async e => {
    e.preventDefault();
    const contributions = roles.map(role => ({
      attributes: {
        role
      },
      relationships: {
        maker: { data: { id: makerId.id } },
        collaboratable: { data: { id: entityId, type: entityType } }
      }
    }));
    const { errors } = await createCollaborator(contributions);

    if (!errors) {
      if (refresh) refresh();
      history.push(closeUrl);
    }
  };

  return (
    <FormContext.Provider value={{ styleType: "secondary" }}>
      <form
        onSubmit={onSubmit}
        method="post"
        className="backend form-secondary"
      >
        <Form.FieldGroup>
          <Unwrapped.Picker
            label={t("glossary.maker_title_case_one")}
            optionToLabel={maker => maker.attributes.fullName}
            predictive
            listStyle={"well"}
            options={makersAPI.index}
            set={val => {
              setMakerId(val);
            }}
            value={makerId}
          />
          <Unwrapped.Picker
            label={t("common.role_other")}
            optionToLabel={role => capitalize(role.replaceAll("_", " "))}
            predictive
            isMultiple
            listStyle="rows"
            options={roleOptions ?? []}
            wide
            value={roles}
            set={val => setRoles(val)}
          />
          <Form.DrawerButtons
            showCancel
            cancelUrl={closeUrl}
            submitLabel="actions.save"
          />
        </Form.FieldGroup>
      </form>
    </FormContext.Provider>
  );
}

AddCollaboratorForm.displayName = "Collaborator.AddEdit.Form";

AddCollaboratorForm.propTypes = {
  entityId: PropTypes.string.isRequired,
  entityType: PropTypes.oneOf(["Project", "Text"]).isRequired,
  closeUrl: PropTypes.string.isRequired,
  refresh: PropTypes.func
};
