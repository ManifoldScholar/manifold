import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import Form from "./Form";
import { Redirect } from "react-router-dom";
import lh from "helpers/linkHandler";
import ContentBlock from "backend/components/content-block";

export class ContentBlockNewContainer extends Component {
  static displayName = "ContentBlock.New";

  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    project: PropTypes.object,
    pendingBlock: PropTypes.object
  };

  get pendingBlock() {
    return this.props.pendingBlock;
  }

  get project() {
    return this.props.project;
  }

  render() {
    // This container is dependent on a pendingBlock being placed in the layout.  If no pendingBlock is
    // passed, we assumed nothing has changed in the layout and close the drawer.
    if (!this.pendingBlock)
      return <Redirect to={lh.link("backendProjectLayout", this.project.id)} />;

    return (
      <section>
        <ContentBlock.DrawerHeader contentBlock={this.pendingBlock} />
        <Form contentBlock={this.pendingBlock} project={this.project} />
      </section>
    );
  }
}

export default connectAndFetch(ContentBlockNewContainer);
