import React from "react";
import PropTypes from "prop-types";
import EntityHero from "frontend/components/composed/EntityHero";
import EntityCollection from "frontend/components/composed/EntityCollection/EntityCollection";
import CollectionNavigation from "frontend/components/composed/CollectionNavigation";
import ContentBlockList from "frontend/components/content-block-list/List";
import { Warning } from "frontend/components/content-block/parts";
import Authorize from "hoc/Authorize";
import { useSelectSettings, useFrontendModeContext } from "hooks";

function Detail({ project }) {
  const { isStandalone } = useFrontendModeContext();
  const settings = useSelectSettings();
  const libraryDisabled = settings.attributes.general.libraryDisabled;

  return (
    <>
      <EntityHero.Project entity={project} />
      <Authorize entity={project} ability="fullyRead" successBehavior="hide">
        <EntityCollection
          BodyComponent={() => <Warning.AccessDenied entity={project} />}
        />
      </Authorize>
      <ContentBlockList entity={project} />
      {!isStandalone && !libraryDisabled && (
        <CollectionNavigation entityType="projects" bgColor="neutral05" />
      )}
    </>
  );
}

Detail.displayName = "Project.Detail";

Detail.propTypes = {
  project: PropTypes.object.isRequired
};

export default Detail;
