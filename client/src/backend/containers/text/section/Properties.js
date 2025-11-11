import { useTranslation } from "react-i18next";
import { useParams, useOutletContext } from "react-router-dom";
import Layout from "backend/components/layout";
import SectionPropertiesForm from "backend/components/authoring/SectionPropertiesForm";
import { useFetch } from "hooks";
import { sectionsAPI } from "api";

export default function TextSectionPropertiesContainer() {
  const { t } = useTranslation();
  const { sectionId } = useParams();
  const { textId, refresh, startSectionId } = useOutletContext() || {};

  const { data: section } = useFetch({
    request: [sectionsAPI.show, sectionId, textId],
    condition: !!sectionId && !!textId
  });

  return sectionId ? (
    <section>
      <Layout.DrawerHeader title={t("texts.properties.header")} />
      <SectionPropertiesForm
        textId={textId}
        section={section}
        refreshText={refresh}
        startSectionId={startSectionId}
      />
    </section>
  ) : null;
}

TextSectionPropertiesContainer.displayName = "Text.Sections.Properties";
