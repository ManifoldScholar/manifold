import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FormContext } from "helpers/contexts";
import Form, { Unwrapped } from "global/components/form";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { useHistory } from "react-router-dom";
import { makersAPI, collaboratorsAPI } from "api";
import { useApiCallback } from "hooks";
import capitalize from "lodash/capitalize";
import Utility from "global/components/utility";
import * as Styled from "./styles";

export default function AddEditCollaboratorForm({ projectId, refresh }) {
  const { t } = useTranslation();
  const history = useHistory();

  const [makerId, setMakerId] = useState("");
  const [roleFieldValues, setRoleFieldValues] = useState([
    { role: "", position: "" }
  ]);

  const fetchRoles = useApiCallback(collaboratorsAPI.roles);

  const [roles, setRoles] = useState(null);

  useEffect(() => {
    const getRoleOptions = async () => {
      const res = await fetchRoles();
      setRoles(res.data);
    };

    if (!roles) {
      getRoleOptions();
    }
  }, [roles, setRoles, fetchRoles]);

  const createCollaborator = useApiCallback(collaboratorsAPI.create);

  const onSubmit = async e => {
    e.preventDefault();
    const contributions = roleFieldValues
      .filter(fieldSet => !!fieldSet.role)
      .map(fieldSet => ({
        attributes: {
          role: fieldSet.role,
          position: fieldSet.position
        },
        relationships: {
          maker: { data: { id: makerId.id } },
          collaboratable: { data: { id: projectId, type: "Project" } }
        }
      }));
    const { errors } = await createCollaborator(contributions);

    if (!errors) {
      if (refresh) refresh();
      history.push(lh.link("backendProjectCollaborators", projectId));
    }
  };

  const addRole = e => {
    e.preventDefault();
    setRoleFieldValues([...roleFieldValues, { role: "", position: "" }]);
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
            label={t("projects.contributor.name_label")}
            optionToLabel={maker => maker.attributes.fullName}
            predictive
            listStyle={"well"}
            options={makersAPI.index}
            set={val => {
              setMakerId(val);
            }}
            value={makerId}
          />
          <Form.FieldGroup
            styleType="secondary"
            label={t("projects.contributor.roles_header")}
          >
            {roleFieldValues.map((r, i) => (
              /* eslint-disable-next-line react/no-array-index-key */
              <Styled.RoleGroup key={i}>
                <Unwrapped.Picker
                  label={t("projects.contributor.role_label")}
                  optionToLabel={role => capitalize(role.replaceAll("_", " "))}
                  predictive
                  listStyle={"well"}
                  options={roles ?? []}
                  wide
                  value={roleFieldValues[i].role}
                  set={val => {
                    const values = [...roleFieldValues];
                    values[i].role = val;
                    setRoleFieldValues(values);
                  }}
                />
                <Form.NumberInput
                  id="position"
                  aria-describedby="position-error"
                  idForError="position-name-error"
                  label={t("projects.contributor.position_label")}
                  instructions={t("projects.contributor.position_instructions")}
                  value={roleFieldValues[i].position}
                  onChange={e => {
                    const values = [...roleFieldValues];
                    values[i].position = e.target.value;
                    setRoleFieldValues(values);
                  }}
                  wide
                />
              </Styled.RoleGroup>
            ))}
            <Styled.RoleButton
              className="button-lozenge-secondary"
              onClick={addRole}
            >
              <Utility.IconComposer icon="circlePlus32" />
              <span>Add Role</span>
            </Styled.RoleButton>
          </Form.FieldGroup>
          <Form.DrawerButtons
            showCancel
            cancelUrl={lh.link("backendProjectCollaborators", projectId)}
            submitLabel="actions.save"
          />
        </Form.FieldGroup>
      </form>
    </FormContext.Provider>
  );
}

AddEditCollaboratorForm.displayName = "Collaborator.AddEdit.Form";

AddEditCollaboratorForm.propTypes = {
  projectId: PropTypes.string.isRequired,
  refresh: PropTypes.func
};
