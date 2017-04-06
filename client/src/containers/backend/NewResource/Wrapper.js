import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form as FormContainer } from 'containers/backend';
import { Resource, Navigation, Form } from 'components/backend';
import { resourcesAPI, notifications } from 'api';
import { notificationActions, entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { browserHistory } from 'react-router';
import { linkHelpers as lh } from 'routes';

const { flush } = entityStoreActions;

class NewResourceWrapperContainer extends PureComponent {

  static displayName = "NewResource.WrapperContainer";
  static activeNavItem = "resources";

  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.handleSuccess = this.handleSuccess.bind(this);
  }

  redirectToResource(resource) {
    const path = lh.backendResource(resource.id);
    browserHistory.push(path);
  }

  handleSuccess(resource) {
    this.redirectToResource(resource);
  }

  render() {
    return (
      <div>
        <Navigation.DetailHeader
          type="resource"
          breadcrumb={[
            {
              path: lh.backendProjectResources(this.props.params.projectId),
              label: "Project"
            }
          ]}
          title={'New Resource'}
          showUtility={false}
          note={'Select your resource type, then enter a name and a brief description.' +
          ' Press save to continue.'}
        />
        <section className="backend-panel">
          <div className="container">
            <div className="panel">
              <FormContainer.Form
                route={this.props.routes[this.props.routes.length - 1]}
                model={{ attributes: { kind: "image" } }}
                name="backend-resource-create"
                update={resourcesAPI.update}
                create={ (model) => resourcesAPI.create(this.props.params.projectId, model) }
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
                  cancelRoute={lh.backendProjectResources(this.props.params.projectId)}
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

