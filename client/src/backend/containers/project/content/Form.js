import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { projectsAPI, contentBlocksAPI, requests } from "api";
import FormContainer from "backend/containers/form";
import Form from "backend/components/form";
import TypeForm from "backend/components/project/Content/TypeForm";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;

export class ProjectContentFormContainer extends Component {
  static displayName = "Project.Content.Form";

  static propTypes = {
    contentBlock: PropTypes.object,
    project: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.contentBlock = this.initializeContentBlock;
  }

  componentDidUpdate() {
    if (this.isPendingBlock) return null;
    this.contentBlock = this.props.contentBlock;
  }

  get isPendingBlock() {
    return this.props.contentBlock.id === "pending";
  }

  get initializeContentBlock() {
    if (this.isPendingBlock) {
      return Object.assign({}, this.props.contentBlock, { id: null });
    }
    return this.props.contentBlock;
  }

  get project() {
    return this.props.project;
  }

  get requestName() {
    return this.isPendingBlock
      ? requests.beContentBlockCreate
      : requests.beContentBlockUpdate;
  }

  fetchContentBlocks = () => {
    const call = projectsAPI.contentBlocks(this.project.id);
    const contentBlocksRequest = request(call, requests.beProjectContentBlocks);
    this.props.dispatch(contentBlocksRequest);
  };

  // We manually assign these values because they come from the pending block, which acts as the
  // source model. Since those values aren't changed, they are not passed to the update request
  // on their own.
  create = model => {
    const adjusted = Object.assign({}, model);
    adjusted.attributes.position = this.contentBlock.attributes.position;
    adjusted.attributes.type = this.contentBlock.attributes.type;

    return contentBlocksAPI.create(this.project.id, adjusted);
  };

  render() {
    return (
      <FormContainer.Form
        model={this.contentBlock}
        name={this.requestName}
        update={contentBlocksAPI.update}
        create={this.create}
        onSuccess={this.fetchContentBlocks}
        className="form-secondary"
        notificationScope="drawer"
        debug
      >
        <TypeForm
          contentBlock={this.props.contentBlock}
          project={this.project}
        />
        <Form.Save text="Save Content Block" />
      </FormContainer.Form>
    );
  }
}

export default connectAndFetch(ProjectContentFormContainer);
