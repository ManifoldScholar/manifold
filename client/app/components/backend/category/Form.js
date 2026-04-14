import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Form from "components/global/form";
import FormContainer from "global/containers/form";

export default function CategoryForm({ model, fetcher }) {
  const { t } = useTranslation();

  return (
    <FormContainer.Form
      model={model}
      fetcher={fetcher}
      className="form-secondary"
    >
      <Form.TextInput
        label={t("glossary.title_title_case_one")}
        focusOnMount
        name="attributes[title]"
        placeholder={t("projects.category.title_placeholder")}
      />
      <Form.Save
        text={
          model ? t("projects.category.update") : t("projects.category.create")
        }
      />
    </FormContainer.Form>
  );
}

CategoryForm.displayName = "Category.Form";

CategoryForm.propTypes = {
  model: PropTypes.object,
  fetcher: PropTypes.object
};
