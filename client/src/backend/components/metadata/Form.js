import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import humps from "humps";
import intersection from "lodash/intersection";
import reduce from "lodash/reduce";
import concat from "lodash/concat";
import difference from "lodash/difference";

export default function MetadataForm({ model, ...restProps }) {
  const { t } = useTranslation();

  const { attributes } = model ?? {};
  const properties = attributes?.metadataProperties?.sort() ?? [];

  const baseStructure = () => {
    return [
      {
        label: t("metadata.categories.copyright"),
        children: intersection(
          [
            "creator",
            "rights",
            "rightsHolder",
            "rightsTerritory",
            "restrictions",
            "credit"
          ],
          properties
        )
      },
      {
        label: t("metadata.categories.identity"),
        children: intersection(
          ["isbn", "issn", "doi", "resourcesDoi", "uniqueIdentifier"],
          properties
        )
      },
      {
        label: t("metadata.categories.publisher"),
        children: intersection(
          [
            "publisher",
            "publisherPlace",
            "originalPublisher",
            "originalPublisherPlace",
            "status"
          ],
          properties
        )
      },
      {
        label: t("metadata.categories.bibliographic"),
        children: intersection(
          [
            "containerTitle",
            "version",
            "seriesTitle",
            "seriesNumber",
            "edition",
            "issue",
            "volume",
            "originalTitle",
            "originalPublicationDate"
          ],
          properties
        )
      },
      {
        label: t("metadata.categories.accessibility"),
        children: intersection(["altText"], properties)
      }
    ];
  };

  const structure = () => {
    const filteredStructure = baseStructure().filter(
      group => group.children?.length > 0
    );
    const leftovers = difference(
      properties,
      reduce(
        filteredStructure,
        (used, group) => concat(used, group.children),
        []
      )
    );
    if (leftovers.length > 0) {
      filteredStructure.push({
        label: t("metadata.categories.other"),
        children: leftovers
      });
    }
    return filteredStructure;
  };

  const getLocalized = (prop, strType) => {
    const i18nKey = humps.decamelize(prop, { separator: "_" }).toLowerCase();

    switch (strType) {
      case "label":
        return t(`metadata.${i18nKey}`);
      case "placeholder":
        return t(`metadata.${i18nKey}_placeholder`, { defaultValue: "" });
      case "instructions":
        return t(`metadata.${i18nKey}_instructions`, { defaultValue: "" });
      default:
        return "";
    }
  };

  const componentAndPropsFor = prop => {
    switch (prop) {
      case "rights":
        return { component: Form.TextArea, props: null };
      case "resourcesDoi":
        return { component: Form.MaskedTextInput, props: { mask: "doi" } };
      case "originalPublicationDate":
        return { component: Form.DatePicker, props: null };
      default:
        return { component: Form.TextInput, props: null };
    }
  };

  return (
    <section>
      <FormContainer.Form model={model} {...restProps}>
        {structure().map((group, gi) => {
          return (
            <Form.FieldGroup label={group.label} key={group.label}>
              {group.children.map((prop, i) => {
                const render = componentAndPropsFor(prop);
                const InputComponent = render.component;
                const inputProps = render.props;
                const focus = gi === 0 && i === 0;
                return (
                  <InputComponent
                    key={prop}
                    focusOnMount={focus}
                    placeholder={getLocalized(prop, "placeholder")}
                    instructions={getLocalized(prop, "instructions")}
                    label={getLocalized(prop, "label")}
                    name={`attributes[metadata][${prop}]`}
                    {...inputProps}
                  />
                );
              })}
            </Form.FieldGroup>
          );
        })}
        <Form.Save text={t("metadata.save")} />
      </FormContainer.Form>
    </section>
  );
}

MetadataForm.displayName = "Metadata.Form";

MetadataForm.propTypes = {
  model: PropTypes.object.isRequired
};
