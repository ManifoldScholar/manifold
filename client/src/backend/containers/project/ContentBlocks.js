import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import List from "backend/components/list";
import ContentBlock from "backend/components/content-block"
import { projectsAPI } from "api";
import lh from "helpers/linkHandler";
import { Draggable } from "react-beautiful-dnd";

import Authorize from "hoc/authorize";

export default class ProjectContentBlocksContainer extends PureComponent {
  static displayName = "Project.ContentBlocks";

  static propTypes = {
    project: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {}
  }

  updateContentBlockPositions = entity => {
    // Update the item
  };

  configureContentBlock = entity => {
    // Open drawer and configure
  };

  // TODO: These could maybe be one component, depending on how we do the styling.  The only difference right now is the dragging placeholder.
  poolComponent = (entity, index) => {
    return <ContentBlock.PoolItem key={entity.id} entity={entity} index={index} />;
  };

  listComponent = (entity, index) => {
    return <ContentBlock.ListItem key={entity.id} entity={entity} index={index} />;
  };

  contentBlocksHeader = () => {
    return (
      <div>
        <h1>Content Blocks</h1>
        <span>Some instructions about content blocks</span>
      </div>
    )
  };

  contentLayoutHeader = () => {
    return (
      <div>
        <h1>Content Layout</h1>
        <span>Some instructions about content layout</span>
      </div>
    )
  };

  render() {
    const project = this.props.project;

    return (
      <Authorize
        entity={project}
        ability="update"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <section>
          <List.SimpleMulti
            poolComponent={this.poolComponent}
            listComponent={this.listComponent}
            afterReorderHandler={this.updateContentBlockPositions}
            afterSelectHandler={this.configureContentBlock}
            selectedHeader={this.contentLayoutHeader}
            poolHeader={this.contentBlocksHeader}
          />
        </section>
      </Authorize>
    );
  }
}
