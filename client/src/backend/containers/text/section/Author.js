import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Layout from "backend/components/layout";
import EditSectionForm from "backend/components/authoring/EditSectionForm";
import AddSectionForm from "backend/components/authoring/AddSectionForm";
import { useParams } from "react-router-dom";
import { useFetch } from "hooks";
import { sectionsAPI } from "api";

export default function AuthorSectionContainer(props) {
  const { t } = useTranslation();
  const { sectionId } = useParams();

  const { data: section } = useFetch({
    request: [sectionsAPI.show, sectionId, props.textId],
    condition: !!sectionId
  });

  return (
    <section>
      {sectionId ? (
        <EditSectionForm section={section} {...props} />
      ) : (
        <>
          <Layout.DrawerHeader title={t("texts.add_section_button_label")} />
          <AddSectionForm {...props} />
        </>
      )}
    </section>
  );
}

AuthorSectionContainer.displayName = "Text.Sections.Author";

AuthorSectionContainer.propTypes = {
  textId: PropTypes.string.isRequired,
  nextPosition: PropTypes.number
};
