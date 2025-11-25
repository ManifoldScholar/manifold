import { useTranslation } from "react-i18next";
import { useParams, useOutletContext } from "react-router-dom";
import Layout from "backend/components/layout";
import Ingestion from "backend/components/ingestion";
import { useFetch, useFromStore } from "hooks";
import { sectionsAPI, ingestionsAPI } from "api";
import lh from "helpers/linkHandler";

export default function IngestSectionContainer() {
  const { textId } = useOutletContext() || {};
  const { t } = useTranslation();
  const { sectionId, ingestionId } = useParams();

  const { data: section } = useFetch({
    request: [sectionsAPI.show, sectionId, textId],
    condition: !!sectionId
  });

  const { data: ingestion } = useFetch({
    request: [ingestionsAPI.show, ingestionId],
    condition: !!ingestionId
  });

  const sectionName = useFromStore({
    path: `entityStore.entities.textSections[${ingestion?.attributes.textSectionId}]`
  })?.attributes.name;

  const shouldRender =
    (!!sectionId && !!section) ||
    (!!ingestionId && !!ingestion) ||
    (!sectionId && !ingestionId);

  return shouldRender ? (
    <section>
      <Layout.DrawerHeader
        title={
          /* eslint-disable-next-line no-nested-ternary */
          sectionId
            ? section?.attributes?.name
            : ingestionId
            ? sectionName ?? t("texts.section.ingest_button_label")
            : t("texts.section.ingest_button_label")
        }
      />
      <Ingestion.Form.SectionWrapper
        textId={textId}
        sectionId={sectionId}
        ingestion={ingestion}
        cancelUrl={lh.link("backendTextSections", textId)}
      />
    </section>
  ) : null;
}

IngestSectionContainer.displayName = "Text.Sections.Ingest";
