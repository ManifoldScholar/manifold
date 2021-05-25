import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import Utility from "global/components/utility";
import CollectedCount from "frontend/components/collecting/me/CollectedCount";
import {
  CollectedProjects,
  CollectedTexts,
  CollectedTextSections,
  CollectedResourceCollections,
  CollectedResources
} from "frontend/components/collecting/collection-blocks";
import { getEntityCollection } from "frontend/components/collecting/helpers";

import { useDispatchMyCollected, useSelectMyCollected } from "hooks";
import Authorize from "hoc/authorize";
import withCurrentUser from "hoc/with-current-user";

function MyStarredContainer({ currentUser }) {
  const [fetchVersion, setFetchVersion] = useState({
    projects: 1,
    texts: 1,
    text_sections: 1,
    resource_collections: 1,
    resources: 1
  });

  useDispatchMyCollected("projects", fetchVersion.projects);
  useDispatchMyCollected("texts", fetchVersion.texts);
  useDispatchMyCollected("text_sections", fetchVersion.text_sections);
  useDispatchMyCollected(
    "resource_collections",
    fetchVersion.resource_collections
  );
  useDispatchMyCollected("resources", fetchVersion.resources);

  const responses = {
    projects: useSelectMyCollected("projects"),
    texts: useSelectMyCollected("texts"),
    textSections: useSelectMyCollected("text_sections"),
    resourceCollections: useSelectMyCollected("resource_collections"),
    resources: useSelectMyCollected("resources")
  };
  const collection = getEntityCollection(currentUser);

  function getCollectedIdsByType(type) {
    const mapping = collection.attributes?.categoryMappings.$uncategorized$;
    if (!mapping || !mapping[type]) return [];
    return mapping[type];
  }

  function getResponsesByType(type) {
    if (!responses || !responses[type]) return [];
    return responses[type].collection || [];
  }

  const onUncollect = useCallback(type => {
    setFetchVersion(prevState => {
      return {
        ...prevState,
        [type]: prevState[type] + 1
      };
    });
  }, []);

  function getCollectedProps(type) {
    return {
      collectedIds: getCollectedIdsByType(type),
      responses: getResponsesByType(type),
      onUncollect: () => onUncollect(type),
      nested: false
    };
  }

  return (
    <Authorize
      kind="any"
      failureRedirect={lh.link("frontendLogin")}
      failureNotification
    >
      <HeadContent title="My Starred" appendTitle />
      <section className="bg-white">
        <div className="entity-section-wrapper container">
          <header className="entity-section-wrapper__heading section-heading">
            <div className="main">
              <Utility.IconComposer
                size={48}
                icon="StarFillUnique"
                iconClass="icon-star-fill--header"
              />
              <div className="body">
                <h1 className="title">My Starred</h1>
              </div>
            </div>
          </header>
          <div className="entity-section-wrapper__details entity-section-wrapper__details--padded-top">
            <CollectedCount collection={collection} />
          </div>
          <div className="entity-section-wrapper__body">
            <CollectedProjects {...getCollectedProps("projects")} />
            <CollectedTexts {...getCollectedProps("texts")} />
            <CollectedTextSections {...getCollectedProps("textSections")} />
            <CollectedResourceCollections
              {...getCollectedProps("resourceCollections")}
            />
            <CollectedResources {...getCollectedProps("resources")} />
          </div>
        </div>
      </section>
    </Authorize>
  );
}

MyStarredContainer.propTypes = {
  currentUser: PropTypes.object
};

export default withCurrentUser(MyStarredContainer);
