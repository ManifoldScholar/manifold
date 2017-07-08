import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Form as FormContainer } from "containers/backend";
import { Resource, Navigation, Form } from "components/backend";
import { resourcesAPI } from "api";
import lh from "helpers/linkHandler";

export class NewResourceWrapperContainer extends PureComponent {
  static displayName = "NewResource.WrapperContainer";
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.handleSuccess = this.handleSuccess.bind(this);
    this.defaultResource = { attributes: { kind: "image" } };
  }

  redirectToResource(resource) {
    const path = lh.link("backendResource", resource.id);
    this.props.history.push(path);
  }

  handleSuccess(resource) {
    this.redirectToResource(resource);
  }

  render() {
    const { match } = this.props;

    return (
      <div>
        <Navigation.DetailHeader
          type="resource"
          breadcrumb={[
            {
              path: lh.link("backendProjectResources", match.params.projectId),
              label: "Resources"
            }
          ]}
          title={"New Resource"}
          showUtility={false}
          note={
            "Select your resource type, then enter a name and a brief description." +
            " Press save to continue."
          }
        />
        <section className="backend-panel">
          <div className="container">
            <div className="panel">
              <FormContainer.Form
                model={this.defaultResource}
                name="backend-resource-create"
                update={resourcesAPI.update}
                create={model =>
                  resourcesAPI.create(match.params.projectId, model)}
                onSuccess={this.handleSuccess}
                className="form-secondary"
              >
                <Resource.Form.KindPicker
                  name="attributes[kind]"
                  includeButtons
                />
                <Form.TextInput
                  label="Title"
                  name="attributes[title]"
                  placeholder="Enter a resource title"
                />
                <Form.TextArea
                  label="Description"
                  name="attributes[description]"
                  placeholder="Enter a description"
                />
                <Resource.Form.KindAttributes />
                <Form.Save
                  text="Save and continue"
                  cancelRoute={lh.link(
                    "backendProjectResources",
                    match.params.projectId
                  )}
                />
              </FormContainer.Form>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connectAndFetch(NewResourceWrapperContainer);
