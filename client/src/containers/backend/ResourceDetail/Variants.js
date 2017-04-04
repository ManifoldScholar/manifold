import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import { Resource } from 'components/backend';
import { resourcesAPI } from 'api';
import { notificationActions } from 'actions';
import { connect } from 'react-redux';

class ResourceDetailVariantsContainer extends PureComponent {

  static displayName = "ResourceDetail.Variants";
  static activeNavItem = "variants";

  static propTypes = {
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section>
        <FormContainer.Form
          route={this.props.routes[this.props.routes.length - 1]}
          model={this.props.resource}
          name="backend-resource-update"
          update={resourcesAPI.update}
          create={(model) => resourcesAPI.create(this.props.params.projectId, model) }
          className="form-secondary"
        >
          <Resource.Form.Kind.Variants kind={this.props.resource.attributes.kind} {...this.props} />
          <Form.Save
            text="Save Resource"
          />
        </FormContainer.Form>
      </section>
    );
  }
}

export default connect(
  ResourceDetailVariantsContainer.mapStateToProps
)(ResourceDetailVariantsContainer);
