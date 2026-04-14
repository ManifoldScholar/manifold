import React from "react";
import PropTypes from "prop-types";
import EntityHero from "components/frontend/entity/Hero";
import EntityCollection from "components/frontend/entity/Collection/EntityCollection";
import CollectionNavigation from "components/frontend/CollectionNavigation";
import ContentBlockList from "components/frontend/content-block-list/List";
import { Warning } from "components/frontend/content-block/parts";
import Authorize from "hoc/Authorize";
import { useSettings, useFrontendMode } from "hooks";

function Detail({ project }) {
  const { isStandalone } = useFrontendMode();
  const settings = useSettings();
  const libraryDisabled = settings?.attributes?.general?.libraryDisabled;

  return (
    <>
      <EntityHero.Project entity={project} />
      <Authorize entity={project} ability="fullyRead" successBehavior="hide">
        <EntityCollection
          BodyComponent={() => <Warning.AccessDenied entity={project} />}
        />
      </Authorize>
      <ContentBlockList entity={project} />
      {!isStandalone && !libraryDisabled && <CollectionNavigation />}
    </>
  );
}

Detail.displayName = "Project.Detail";

Detail.propTypes = {
  project: PropTypes.object.isRequired
};

export default Detail;
