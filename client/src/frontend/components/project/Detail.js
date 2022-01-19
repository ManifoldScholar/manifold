import React from "react";
import PropTypes from "prop-types";
import LoadingBlock from "global/components/loading-block";
import EntityCollection from "frontend/components/composed/EntityCollection/EntityCollection";
import Layout from "frontend/components/layout";
import EntityHero from "frontend/components/composed/EntityHero";
import ContentBlockList from "frontend/components/content-block-list/List";
import { Warning } from "frontend/components/content-block/parts";
import Authorize from "hoc/authorize";
import { useSelectSettings } from "hooks/settings";
import { useFrontendModeContext } from "hooks/contexts";

function Detail({ project }) {
  const { isStandalone } = useFrontendModeContext();
  const settings = useSelectSettings();
  const libraryDisabled = settings.attributes.general.libraryDisabled;

  if (!project) return <LoadingBlock />;

  return (
    <>
      <EntityHero.Project entity={project} />
      <Authorize entity={project} ability="fullyRead" successBehavior="hide">
        <EntityCollection
          BodyComponent={() => <Warning.AccessDenied entity={project} />}
        />
      </Authorize>
      <ContentBlockList entity={project} />
      {!isStandalone && !libraryDisabled && <Layout.ButtonNavigation />}
    </>
  );
}

Detail.displayName = "Project.Detail";

Detail.propTypes = {
  project: PropTypes.object
};

export default Detail;
