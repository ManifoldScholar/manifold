import { useTranslation } from "react-i18next";
import { useParams, useOutletContext } from "react-router-dom";
import Layout from "backend/components/layout";
import EditSectionForm from "backend/components/authoring/EditSectionForm";
import AddSectionForm from "backend/components/authoring/AddSectionForm";
import { useFetch } from "hooks";
import { sectionsAPI } from "api";

export default function AuthorSectionContainer() {
  const { t } = useTranslation();
  const { sectionId } = useParams();
  const context = useOutletContext() || {};
  const { textId, appliesToAllStylesheets, nextPosition, refresh } = context;

  const { data: section } = useFetch({
    request: [sectionsAPI.show, sectionId, textId],
    condition: !!sectionId && !!textId
  });

  const formProps = {
    textId,
    appliesToAllStylesheets,
    nextPosition,
    refresh
  };

  return (
    <section>
      {sectionId ? (
        <EditSectionForm section={section} {...formProps} />
      ) : (
        <>
          <Layout.DrawerHeader title={t("texts.add_section_button_label")} />
          <AddSectionForm {...formProps} />
        </>
      )}
    </section>
  );
}

AuthorSectionContainer.displayName = "Text.Sections.Author";
