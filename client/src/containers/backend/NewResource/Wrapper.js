import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form as FormContainer } from 'containers/backend';
import { Resource, Navigation, Form } from 'components/backend';
import { resourcesAPI } from 'api';
import { notificationActions } from 'actions';
import { entityUtils } from 'utils';
import { browserHistory } from 'react-router';

class NewResourceWrapperContainer extends PureComponent {

  static displayName = "NewResource.WrapperContainer";
  static activeNavItem = "resources";

  static propTypes = {
  };

  constructor(props) {
    super(props);

    this.state = {
      resourceKind: 'image'
    };

    this.handleSuccess = this.handleSuccess.bind(this);
    this.setResourceKind = this.setResourceKind.bind(this);
  }

  redirectToResource(resource) {
    browserHistory.push(`/backend/resource/${resource.id}`);
  }

  setResourceKind(kind) {
    this.setState({
      resourceKind: kind
    });
  }

  handleSuccess(resource) {
    this.redirectToResource(resource);
  }

  renderFormSectionForKind() {
    if (!this.state.resourceKind && !this.props.sourceModel.attributes.kind) return null;
    const kind = this.state.resourceKind ? this.state.resourceKind : this.props.sourceModel.attributes.kind;
    switch (kind) {
      case "image":
        return <Resource.Form.Kind.Image {...this.props}/>;
        break;
      case "video":
        return <Resource.Form.Kind.Video {...this.props}/>;
        break;
      case "audio":
        return <Resource.Form.Kind.Audio {...this.props}/>;
        break;
      case "interactive":
        return <Resource.Form.Kind.Interactive {...this.props}/>;
        break;
      case "link":
        return <Resource.Form.Kind.Link {...this.props}/>;
        break;
      case "spreadsheet":
        return <Resource.Form.Kind.Spreadsheet {...this.props}/>;
        break;
      case "document":
        return <Resource.Form.Kind.Document {...this.props}/>;
        break;
      case "presentation":
        return <Resource.Form.Kind.Presentation {...this.props}/>;
        break;
      case "pdf":
        return <Resource.Form.Kind.Pdf {...this.props}/>;
        break;
      case "file":
        return <Resource.Form.Kind.File {...this.props}/>;
        break;
    }
  }

  render() {
    return (
      <div>
        <Navigation.DetailHeader
          type="resource"
          breadcrumb={[
            { path: `/backend/project/${this.props.params.projectId}/resources`, label: "Project" }
          ]}
          title={'New Resource'}
          showUtility={false}
          note={'Select your resource type, then enter a name and a brief description. Press save to continue.'}
        />
        <section className="backend-panel">
          <div className="container">
            <div className="panel">
              <Resource.Form.KindPicker
                kind={this.state.resourceKind}
                setKind={this.setResourceKind}
              />
              <FormContainer.Form
                route={this.props.routes[this.props.routes.length - 1]}
                model={this.props.resource}
                name="backend-resource-create"
                update={resourcesAPI.update}
                create={(model) => resourcesAPI.create(this.props.params.projectId, model) }
                onSuccess={this.handleSuccess}
                className="form-secondary"
                debug={true}
              >
                <Form.TextInput
                  label="Title"
                  focusOnMount
                  name="attributes[title]"
                  placeholder="Enter a resource title"
                />
                <Form.TextArea
                  label="Description"
                  focusOnMount
                  name="attributes[description]"
                  placeholder="Enter a description"
                />
                {this.renderFormSectionForKind()}
                <Form.TextInput
                  label="Temporary Kind Field"
                  name="attributes[kind]"
                  placeholder="Manually type in kind for now"
                />
                <Form.Save
                  text="Save and continue"
                />
              </FormContainer.Form>
            </div>
          </div>
        </section>
      </div>
    );
  }

}

export default connect(
  NewResourceWrapperContainer.mapStateToProps
)(NewResourceWrapperContainer);

