import React, { Component } from "react";
import PropTypes from "prop-types";
import LoadingBlock from "global/components/loading-block";
import EntityCollection from "frontend/components/composed/EntityCollection/EntityCollection";
import Layout from "frontend/components/layout";
import EntityHero from "frontend/components/composed/EntityHero";
import ContentBlockList from "frontend/components/content-block-list/List";
import { Warning } from "frontend/components/content-block/parts";
import { FrontendModeContext } from "helpers/contexts";
import withSettings from "hoc/with-settings";
import Authorize from "hoc/authorize";

class Detail extends Component {
  static displayName = "Project.Detail";

  static propTypes = {
    project: PropTypes.object,
    settings: PropTypes.object
  };

  static contextType = FrontendModeContext;

  componentDidMount() {
    if (window && window.ScrollTo) window.scrollTo(0, 0);
  }

  get isLibraryDisabled() {
    return this.props.settings.attributes.general.libraryDisabled;
  }

  render() {
    const { project } = this.props;
    if (!project) return <LoadingBlock />;
    return (
      <>
        <section>
          <EntityHero.Project entity={project} />
          <Authorize
            entity={project}
            ability="fullyRead"
            successBehavior="hide"
          >
            <EntityCollection
              BodyComponent={() => <Warning.AccessDenied entity={project} />}
            />
          </Authorize>
          <ContentBlockList entity={project} />
        </section>
        {!this.context.isStandalone && !this.isLibraryDisabled && (
          <Layout.ButtonNavigation />
        )}
      </>
    );
  }
}

export default withSettings(Detail);
