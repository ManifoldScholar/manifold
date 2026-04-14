import React from "react";
import PropTypes from "prop-types";
import CollectionNavigation from "components/frontend/CollectionNavigation";
import EntityCollection from "components/frontend/entity/Collection/EntityCollection";
import EntityHero from "components/frontend/entity/Hero";
import ContentBlockList from "components/frontend/content-block-list/List";
import { Warning } from "components/frontend/content-block/parts";
import { useSettings, useFrontendMode } from "hooks";
import Authorize from "hoc/Authorize";

function Detail({ issue }) {
  const { isStandalone } = useFrontendMode();
  const settings = useSettings();
  const libraryDisabled = settings?.attributes?.general?.libraryDisabled;

  return (
    <>
      <EntityHero.Issue entity={issue} />
      <Authorize entity={issue} ability="fullyRead" successBehavior="hide">
        <EntityCollection
          BodyComponent={() => <Warning.AccessDenied entity={issue} />}
        />
      </Authorize>
      <ContentBlockList entity={issue} />
      {!isStandalone && !libraryDisabled && (
        <CollectionNavigation entityType="journals" bgColor="neutral05" />
      )}
    </>
  );
}

Detail.displayName = "Issue.Detail";

Detail.propTypes = {
  issue: PropTypes.object.isRequired
};

export default Detail;
