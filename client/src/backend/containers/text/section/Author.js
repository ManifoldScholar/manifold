import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Navigation from "backend/components/navigation";
import AddEditSectionForm from "backend/components/authoring/AddEditSectionForm";
import AddSectionForm from "backend/components/authoring/AddSectionForm";
import { useParams } from "react-router-dom";
import { useFetch } from "hooks";
import { sectionsAPI } from "api";

export default function AuthorSectionContainer(props) {
  const { t } = useTranslation();
  const { sectionId } = useParams();

  const { data: section } = useFetch({
    request: [sectionsAPI.show, sectionId],
    condition: !!sectionId
  });

  return (
    <section>
      <Navigation.DrawerHeader
        title={
          sectionId
            ? t("texts.edit_section")
            : t("texts.add_section_button_label")
        }
      />
      {sectionId ? (
        section && <AddEditSectionForm section={section} {...props} />
      ) : (
        <AddSectionForm {...props} />
      )}
    </section>
  );
}

AuthorSectionContainer.displayName = "Text.Sections.Author";

AuthorSectionContainer.propTypes = {
  textId: PropTypes.string.isRequired,
  nextPosition: PropTypes.number
};
