import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import { projectsAPI, contentBlocksAPI, requests } from "api";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import ContentBlock from "backend/components/content-block";
import { entityStoreActions } from "actions";
import lh from "helpers/linkHandler";

const { request } = entityStoreActions;

export class ProjectContentFormContainer extends Component {
  static displayName = "Project.Content.Form";

  static propTypes = {
    contentBlock: PropTypes.object,
    project: PropTypes.object,
    history: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object,
    t: PropTypes.func
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
      return { ...this.props.contentBlock, id: null };
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

  closeDrawer = () => {
    this.fetchContentBlocks();
    return this.props.history.push(
      lh.link("backendProjectLayout", this.project.id),
      { noScroll: true }
    );
  };

  fetchContentBlocks = () => {
    const call = projectsAPI.contentBlocks(this.project.id);
    const contentBlocksRequest = request(call, requests.beProjectContentBlocks);
    this.props.dispatch(contentBlocksRequest);
  };

  // We manually assign these values because they come from the pending block, which acts as the
  // source model. Since those values aren't changed, they are not passed to the update request
  // on their own.
  create = model => {
    const adjusted = { ...model };
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
        onSuccess={this.closeDrawer}
        className="form-secondary"
        notificationScope="drawer"
      >
        <ContentBlock.TypeForm
          contentBlock={this.props.contentBlock}
          project={this.project}
        />
        <Form.Save text={this.props.t("actions.save")} />
      </FormContainer.Form>
    );
  }
}

export default withTranslation()(connectAndFetch(ProjectContentFormContainer));
