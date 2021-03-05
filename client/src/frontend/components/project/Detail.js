import React, { Component } from "react";
import PropTypes from "prop-types";
import LoadingBlock from "global/components/loading-block";
import Layout from "frontend/components/layout";
import Hero from "./Hero";
import Content from "./Content/index";
import { FrontendModeContext } from "helpers/contexts";
import withSettings from "hoc/with-settings";
import AccessDenied from "./AccessDenied";
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

  isLibraryDisabled() {
    return this.props.settings.attributes.general.libraryDisabled;
  }

  render() {
    const { project } = this.props;
    if (!project) return <LoadingBlock />;
    return (
      <>
        <section>
          <Hero project={project} />
          <Authorize
            entity={project}
            ability="fullyRead"
            successBehavior="hide"
          >
            <AccessDenied project={project} />
          </Authorize>
          <Content project={project} />
        </section>
        {!this.context.isStandalone && !this.isLibraryDisabled && (
          <Layout.ButtonNavigation />
        )}
      </>
    );
  }
}

export default withSettings(Detail);
