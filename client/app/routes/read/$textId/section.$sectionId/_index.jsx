import { useOutletContext, Outlet, data } from "react-router";
import Section from "components/reader/section";
import {
  sectionsAPI,
  annotationsAPI,
  resourcesAPI,
  resourceCollectionsAPI
} from "api";
import HeadContent from "components/global/HeadContent";
import useEntityHeadContent from "components/frontend/entity/useEntityHeadContent";
import EventTracker, { EVENTS } from "components/global/EventTracker";
import { useContext } from "react";
import { ReaderContext } from "app/contexts";
import loadParallelLists from "app/routes/utility/loaders/loadParallelLists";

export const loader = async ({ params, context }) => {
  const { textId, sectionId } = params;

  const results = await loadParallelLists({
    context,
    fetchFns: {
      section: () => sectionsAPI.show(sectionId, textId),
      annotations: () => annotationsAPI.forSection(sectionId, textId),
      resources: () => resourcesAPI.forSection(sectionId, textId),
      resourceCollections: () =>
        resourceCollectionsAPI.forSection(sectionId, textId)
    }
  });

  if (!results.section) {
    throw data(null, { status: 404 });
  }

  return {
    section: results.section,
    annotations: results.annotations ?? [],
    resources: results.resources ?? [],
    resourceCollections: results.resourceCollections ?? []
  };
};

export default function SectionRoute({ loaderData }) {
  const { section, annotations } = loaderData;

  const text = useOutletContext();

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
      <Outlet context={{ text, section }} />
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
