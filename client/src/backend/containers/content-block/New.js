import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { contentBlocksAPI } from "api";
import Form from "backend/containers/project/content/Form";
import lh from "helpers/linkHandler";
import { Redirect } from "react-router-dom";

export class ContentBlockNewContainer extends Component {
  static displayName = "ContentBlock.New";

  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    pendingBlock: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  get pendingBlock() {
    return this.props.pendingBlock;
  }

  get projectId() {
    return this.props.match.params.pId;
  }

  handleSuccess = () => {
    const path = lh.link("backendProjectProjectPage", this.projectId);
    this.props.history.push(path);
  };

  handleContentBlockCreate = contentBlock => {
    return contentBlocksAPI.create(this.projectId, contentBlock);
  };

  render() {
    // This container is dependent on a pendingBlock being placed in the layout.  If no pendingBlock is
    // passed, we assumed nothing has changed in the layout and close the drawer.
    if (!this.pendingBlock) return <Redirect to={lh.link("backendProjectProjectPage", this.projectId)} />;

    return (
      <section>
        <header className="drawer-header">
          <h2 className="heading-quaternary">Configure Content Block</h2>
        </header>
        <Form
          contentBlock={this.pendingBlock}
          createHandler={this.handleContentBlockCreate}
        />
      </section>
    );
  }
}

export default connectAndFetch(ContentBlockNewContainer);
