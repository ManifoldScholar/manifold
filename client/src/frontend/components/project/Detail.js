import React, { Component } from "react";
import PropTypes from "prop-types";
import LoadingBlock from "global/components/loading-block";
import Layout from "frontend/components/layout";
import Hero from "./Hero";
import ContentBlock from "frontend/components/content-block";
import { FrontendModeContext } from "helpers/contexts";
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

  render() {
    const { project } = this.props;
    if (!project) return <LoadingBlock />;

    return (
      <div>
        <Hero project={project} />
        <ContentBlock project={project} />
        {!this.context.isStandalone && <Layout.ButtonNavigation />}
      </div>
    );
  }
}

export default Detail;
