import { useEffect, useContext } from "react";
import PropTypes from "prop-types";
import typeResolver from "../helpers/resolver";
import Form from "../../../../global/components/form";
import { useTranslation } from "react-i18next";
import { FormContext } from "helpers/contexts";
import { brackets2dots } from "utils/string";
import { unwrappedForDefaultAttrs } from "./types";

export default function ProjectContentTypeForm({ contentBlock, project }) {
  const { t } = useTranslation();
  const formContext = useContext(FormContext);
  const setValue = formContext?.actions?.setValue;
  const getModelValue = formContext?.getModelValue ?? (() => null);

  const isNew = contentBlock?.id === "pending";
  const type = contentBlock?.attributes?.type;

  useEffect(() => {
    if (!isNew || !setValue) return;
    const key = type?.split("::")?.[1]?.replace("Block", "");
    const defaults = key
      ? unwrappedForDefaultAttrs[key]?.defaultAttributes
      : null;
    if (!defaults) return;
    Object.keys(defaults).forEach(attr =>
      setValue(brackets2dots(`attributes[${attr}]`), defaults[attr])
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const TypeForm = typeResolver.typeToFormComponent(type);

  return (
    <>
      <Form.Select
        label="Access"
        options={[
          {
            label: t("layout.visibility_options.always"),
            value: "always"
          },
          {
            label: t("layout.visibility_options.authorized"),
            value: "authorized"
          },
          {
            label: t("layout.visibility_options.unauthorized"),
            value: "unauthorized"
          }
        ]}
        name="attributes[access]"
      />
      <TypeForm
        contentBlock={contentBlock}
        project={project}
        getModelValue={getModelValue}
        setOther={(value, name) => setValue?.(brackets2dots(name), value)}
      />
    </>
  );
}

ProjectContentTypeForm.displayName = "Project.Content.TypeForm";

ProjectContentTypeForm.propTypes = {
  contentBlock: PropTypes.object,
  project: PropTypes.object
};
