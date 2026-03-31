import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FormContext } from "helpers/contexts";
import Form from "global/components/form";
import InputError from "global/components/form/InputError";
import { useTranslation, Trans } from "react-i18next";
import { makersAPI, collaboratorsAPI } from "api";
import { useApiCallback } from "hooks";
import capitalize from "lodash/capitalize";
import * as Styled from "./styles";

export default function AddCollaboratorForm({
  closeUrl,
  fetcher,
  collaborator
}) {
  const { t } = useTranslation();

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

  const serverErrors = fetcher.data?.errors;

  const allErrors = formErrors || serverErrors || null;
  const makerErrors = allErrors?.filter(e => e.source === "maker");
  const roleErrors = allErrors?.filter(e => e.source === "roles");

  const onSubmit = e => {
    e.preventDefault();

    if (!collaborator && !maker?.id) {
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

    setFormErrors(null);

    const makerId = maker?.id || collaborator?.relationships?.maker?.id;

    const data = {
      roles,
      maker: { id: makerId, type: "maker" },
      ...(collaborator ? { position: collaborator.attributes.position } : {})
    };

    fetcher.submit(JSON.stringify(data), {
      method: "POST",
      encType: "application/json"
    });
  };

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
              <Form.Picker
                label={t("glossary.maker_title_case_one")}
                optionToLabel={record => record.attributes.fullName}
                predictive
                listStyle={"well"}
                options={makersAPI.index}
                onChange={val => {
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
            <Form.Picker
              label={t("common.role_other")}
              optionToLabel={role => capitalize(role.replaceAll("_", " "))}
              predictive
              isMultiple
              listStyle="rows"
              options={roleOptions ?? []}
              value={roles}
              onChange={val => setRoles(val)}
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
  closeUrl: PropTypes.string.isRequired,
  fetcher: PropTypes.object.isRequired,
  collaborator: PropTypes.object
};
