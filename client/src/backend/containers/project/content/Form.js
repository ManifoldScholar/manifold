import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { requests } from "api";
import FormContainer from "backend/containers/form";
import Form from "backend/components/form";
import TypeForm from "backend/components/project/Content/TypeForm";
import lh from "helpers/linkHandler";

export class ProjectContentFormContainer extends Component {
  static displayName = "Project.Content.Form";

  static propTypes = {
    contentBlock: PropTypes.object,
    match: PropTypes.object,
    updateHandler: PropTypes.func,
    createHandler: PropTypes.func
  };

  static defaultProps = {
    updateHandler: () => null,
    createHandler: () => null
  };

  get contentBlock() {
    return Object.assign({}, this.props.contentBlock, { id: null });
  }

  get projectId() {
    return this.props.match.params.pId;
  }

  get requestName() {
    return this.props.contentBlock.id === "pending"
      ? requests.beContentBlockCreate
      : requests.beContentBlockUpdate;
  }

  handleSuccess = () => {
    const path = lh.link("backendProjectProjectPage", this.projectId);
    this.props.history.push(path);
  };

  create = model => {
    const adjusted = Object.assign({}, model);
    adjusted.attributes.position = this.contentBlock.attributes.position;
    adjusted.attributes.type = this.contentBlock.type;

    return this.props.createHandler(adjusted);
  };

  render() {
    return (
      <FormContainer.Form
        model={this.contentBlock}
        name={this.requestName}
        update={this.props.updateHandler}
        create={this.create}
        className="form-secondary"
        debug
      >
        <TypeForm contentBlock={this.props.contentBlock} />
        <Form.Save text="Save Content Block" />
      </FormContainer.Form>
    );
  }
}

export default connectAndFetch(ProjectContentFormContainer);
