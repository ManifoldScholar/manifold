import { useParams, useOutletContext, Outlet } from "react-router-dom";
import Section from "reader/components/section";
import {
  sectionsAPI,
  annotationsAPI,
  resourcesAPI,
  resourceCollectionsAPI,
  requests
} from "api";
import HeadContent from "global/components/HeadContent";
import useEntityHeadContent from "frontend/components/entity/useEntityHeadContent";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import { useFetch, useFromStore } from "hooks";

export default function SectionContainer() {
  const { textId, sectionId } = useParams();

  const { text } = useOutletContext() || {};

  const appearance = useFromStore({ path: "ui.persistent.reader" });

  const { data: section } = useFetch({
    request: [sectionsAPI.show, sectionId, textId],
    condition: !!sectionId && !!textId
  });

  const { data: annotations } = useFetch({
    request: [annotationsAPI.forSection, sectionId, textId],
    options: { requestKey: requests.rAnnotations },
    condition: !!sectionId && !!textId,
    refetchOnLogin: true
  });

  const { data: resources } = useFetch({
    request: [resourcesAPI.forSection, sectionId, textId],
    condition: !!sectionId && !!textId
  });

  const { data: resourceCollections } = useFetch({
    request: [resourceCollectionsAPI.forSection, sectionId, textId],
    condition: !!sectionId && !!textId
  });

  const headContentProps = useEntityHeadContent(section, text);

  if (!section?.attributes || !text) return null;

  const globalStylesheet = text.relationships?.stylesheets?.find(
    s => s.attributes.appliesToAllTextSections
  );
  const sectionStylesheets = Object.values(
    section.relationships?.stylesheets || {}
  );
  const stylesheets = globalStylesheet
    ? [globalStylesheet, ...sectionStylesheets]
    : sectionStylesheets;

  const categoryTitle = text.relationships?.category?.attributes?.title;

  return (
    <>
      <EventTracker event={EVENTS.VIEW_RESOURCE} resource={section} />
      {stylesheets.map(stylesheet => (
        <style
          key={stylesheet.id}
          dangerouslySetInnerHTML={{
            __html: `@layer custom-styles {${stylesheet.attributes.styles}}`
          }}
        />
      ))}
      <HeadContent {...headContentProps} />
      <Outlet context={{ text, section }} />
      <Section.Text
        text={text}
        section={section}
        annotations={annotations}
        resources={resources}
        resourceCollections={resourceCollections}
      />
      <div>
        <Section.NextSection
          sectionsMap={text.attributes.sectionsMap}
          text={text}
          sectionId={section.id}
          typography={appearance?.typography}
        />
        <Section.Pagination
          text={text}
          sectionId={section.id}
          sectionsMap={text.attributes.sectionsMap}
        />
      </div>
      {!text.attributes.published && categoryTitle && (
        <Section.Label label={categoryTitle} />
      )}
    </>
  );
}

SectionContainer.displayName = "Section.Container";
