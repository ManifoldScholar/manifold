import React, { useState, useCallback } from "react";
import { meAPI } from "api";
import lh from "helpers/linkHandler";
import { useTranslation } from "react-i18next";
import HeadContent from "global/components/HeadContent";
import EntityCollection from "frontend/components/entity/Collection";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import { getEntityCollection } from "frontend/components/collecting/helpers";
import { useFetch, useCurrentUser } from "hooks";

import Authorize from "hoc/Authorize";

function MyStarredContainer() {
  const [fetchVersion, setFetchVersion] = useState({
    projects: 1,
    texts: 1,
    text_sections: 1,
    resource_collections: 1,
    resources: 1
  });

  const { data: projects } = useFetch({
    request: [meAPI.myCollected, "projects"],
    dependencies: [fetchVersion.projects]
  });
  const { data: texts } = useFetch({
    request: [meAPI.myCollected, "texts"],
    dependencies: [fetchVersion.texts]
  });
  const { data: textSections } = useFetch({
    request: [meAPI.myCollected, "text_sections"],
    dependencies: [fetchVersion.text_sections]
  });
  const { data: resourceCollections } = useFetch({
    request: [meAPI.myCollected, "resource_collections"],
    dependencies: [fetchVersion.resource_collections]
  });
  const { data: resources } = useFetch({
    request: [meAPI.myCollected, "resources"],
    dependencies: [fetchVersion.resources]
  });
  const { data: journalIssues } = useFetch({
    request: [meAPI.myCollected, "journal_issues"],
    dependencies: [fetchVersion.resources]
  });

  const responses = {
    projects,
    texts,
    textSections,
    resourceCollections,
    resources,
    journalIssues
  };

  const currentUser = useCurrentUser();
  const collection = getEntityCollection(currentUser);

  const onUncollect = useCallback(type => {
    setFetchVersion(prevState => {
      return {
        ...prevState,
        [type]: prevState[type] + 1
      };
    });
  }, []);

  const { t } = useTranslation();

  return (
    <Authorize
      kind="any"
      failureRedirect={lh.link("frontendLogin")}
      failureNotification
    >
      <HeadContent title={t("pages.my_starred")} appendDefaultTitle />
      <EntityCollection.MyStarred
        collection={collection}
        responses={responses}
        onUncollect={onUncollect}
      />
      <CollectionNavigation />
    </Authorize>
  );
}

export default MyStarredContainer;
