import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom-v5-compat";
import ResourceDetail from "frontend/components/resource/Detail";
import { fatalErrorActions } from "actions";
import { resourcesAPI, resourceCollectionsAPI, requests } from "api";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { breadcrumbs } from "./breadcrumbs";
import HeadContent from "global/components/HeadContent";
import useEntityHeadContent from "frontend/components/entity/useEntityHeadContent";
import some from "lodash/some";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import { useFetch } from "hooks";

export default function ResourceDetailContainer({
  project,
  journalBreadcrumbs
}) {
  const { resourceId, resourceCollectionId } = useParams();
  const { data: resource } = useFetch({
    request: [resourcesAPI.show, resourceId],
    options: { requestKey: requests.feResource },
    refetchOnLogin: true
  });
  const { data: collection } = useFetch({
    request: [resourceCollectionsAPI.show, resourceCollectionId],
    condition: !!resourceCollectionId
  });

  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const collectionIncludesResource = (c, r) => {
      return some(c.relationships.resources, cR => {
        return cR.id === r.id;
      });
    };

    if (resource && collection) {
      if (!collectionIncludesResource(collection, resource)) {
        dispatch(fatalErrorActions.trigger404());
      }
    }
  }, [resource, collection, dispatch]);

  const headContentProps = useEntityHeadContent(resource, project);

  if (!project || !resource) {
    return null;
  }

  return (
    <>
      <EventTracker event={EVENTS.VIEW_RESOURCE} resource={resource} />
      <CheckFrontendMode debugLabel="ResourceDetail" isProjectSubpage />
      <HeadContent {...headContentProps} />
      <RegisterBreadcrumbs
        breadcrumbs={breadcrumbs({
          project,
          resource,
          collection,
          journalBreadcrumbs,
          t,
          pathname
        })}
      />
      <ResourceDetail
        projectTitle={project.attributes.titlePlaintext}
        resource={resource}
      />
    </>
  );
}

ResourceDetailContainer.propTypes = {
  project: PropTypes.object,
  journalBreadcrumbs: PropTypes.array
};

ResourceDetailContainer.displayName = "Frontend.Containers.ResourceDetail";
