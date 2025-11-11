import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FormContext } from "helpers/contexts";
import Form, { Unwrapped } from "global/components/form";
import InputError from "global/components/form/InputError";
import { useTranslation, Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { makersAPI, collaboratorsAPI } from "api";
import { useApiCallback } from "hooks";
import capitalize from "lodash/capitalize";
import * as Styled from "./styles";

export default function AddCollaboratorForm({
  entityId,
  entityType,
  closeUrl,
  refresh,
  collaborator
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [maker, setMaker] = useState(
    collaborator?.relationships?.maker.data || ""
  );
  const [roles, setRoles] = useState(collaborator?.attributes?.roles || []);
  const [formErrors, setFormErrors] = useState(null);

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

  const updateCollaborator = useApiCallback(collaboratorsAPI.update);

  const onSubmit = async e => {
    e.preventDefault();

    if (!maker?.id) {
      return setFormErrors([
        {
          detail: (
            <Trans
              i18nKey="projects.contributor_maker_error"
              components={[<Styled.ErrorLink to="/backend/records/makers" />]}
            />
          ),
          source: "maker"
        }
      ]);
    }

    if (!roles?.length) {
      return setFormErrors([
        {
          detail: t("projects.contributor_role_error"),
          source: "roles"
        }
      ]);
    }

    const data = {
      roles,
      maker: { id: maker.id, type: "maker" },
      ...(collaborator ? { position: collaborator.attributes.position } : {})
    };

    const callback = collaborator ? updateCollaborator : createCollaborator;

    try {
      const { errors } = await callback(
        `${entityType.toLowerCase()}s`,
        entityId,
        data
      );

      if (!errors) {
        if (refresh) refresh();
        navigate(closeUrl);
      }
    } catch (err) {
      setFormErrors(err?.body?.errors);
    }
  };

  const makerErrors = formErrors?.filter(e => e.source === "maker");
  const roleErrors = formErrors?.filter(e => e.source === "roles");

  return (
    <FormContext.Provider value={{ styleType: "secondary" }}>
      <form
        onSubmit={onSubmit}
        method="post"
        className="backend form-secondary"
      >
        <Form.FieldGroup>
          {!collaborator && (
            <Form.FieldWrapper className="wide">
              <Unwrapped.Picker
                label={t("glossary.maker_title_case_one")}
                optionToLabel={record => record.attributes.fullName}
                predictive
                listStyle={"well"}
                options={makersAPI.index}
                set={val => {
                  setMaker(val);
                }}
                value={maker}
                aria-describedby={
                  makerErrors?.length ? "collaborator-maker-error" : undefined
                }
              />
              {!!makerErrors?.length && (
                <InputError
                  errors={makerErrors}
                  idForError="collaborator-maker-error"
                />
              )}
            </Form.FieldWrapper>
          )}
          <Form.FieldWrapper className="wide">
            <Unwrapped.Picker
              label={t("common.role_other")}
              optionToLabel={role => capitalize(role.replaceAll("_", " "))}
              predictive
              isMultiple
              listStyle="rows"
              options={roleOptions ?? []}
              value={roles}
              set={val => setRoles(val)}
              aria-describedby={
                makerErrors?.length ? "collaborator-role-error" : undefined
              }
            />
            {!!roleErrors?.length && (
              <InputError
                errors={roleErrors}
                idForError="collaborator-role-error"
              />
            )}
          </Form.FieldWrapper>
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
