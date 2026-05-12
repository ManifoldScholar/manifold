import { useOutletContext } from "react-router";
import Section from "components/reader/section";
import { annotationsAPI, resourcesAPI, resourceCollectionsAPI } from "api";
import HeadContent from "components/global/HeadContent";
import useEntityHeadContent from "components/frontend/entity/useEntityHeadContent";
import EventTracker, { EVENTS } from "components/global/EventTracker";
import { useContext } from "react";
import { ReaderContext } from "app/contexts";
import loadParallelLists from "lib/react-router/loaders/loadParallelLists";
import loadAllPages from "lib/react-router/loaders/loadAllPages";

export const loader = async ({ params, context }) => {
  const { textId, sectionId } = params;

  const results = await loadParallelLists({
    context,
    fetchFns: {
      annotations: () => annotationsAPI.forSection(sectionId, textId),
      resources: () => resourcesAPI.forSection(sectionId, textId),
      resourceCollections: () =>
        resourceCollectionsAPI.forSection(sectionId, textId)
    }
  });

  return {
    annotations: results.annotations,
    resources: results.resources.data,
    resourceCollections: results.resourceCollections.data
  };
};

export const clientLoader = async ({ params, request, serverLoader }) => {
  const server = await serverLoader();
  const { textId, sectionId } = params;

  const annotations = await loadAllPages({
    request: annotationsAPI.forSection(sectionId, textId),
    initial: server.annotations,
    signal: request.signal
  });

  return { ...server, annotations };
};

clientLoader.hydrate = true;

export default function SectionRoute({ loaderData }) {
  const {
    annotations: { data: annotations }
  } = loaderData;

  const { text, section } = useOutletContext();

  const { typography } = useContext(ReaderContext);

  const headContentProps = useEntityHeadContent(section, text);

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
      <Section.Text text={text} section={section} annotations={annotations} />
      <div>
        <Section.NextSection
          sectionsMap={text.attributes.sectionsMap}
          text={text}
          sectionId={section.id}
          typography={typography}
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
