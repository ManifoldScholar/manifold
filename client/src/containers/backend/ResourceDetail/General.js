import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import { Resource } from 'components/backend';
import { resourcesAPI } from 'api';
import { notificationActions } from 'actions';
import { connect } from 'react-redux';

class ResourceDetailGeneralContainer extends PureComponent {

  static displayName = "ResourceDetail.General";
  static activeNavItem = "general";

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
          debug={true}
          create={(model) => resourcesAPI.create(this.props.params.projectId, model) }
          className="form-secondary"
        >
          <Form.Select
            label="kind"
            name="attributes[kind]"
            focusOnMount
            options={[
              {label: "Select a resource type", value: ""},
              {label: "Attachment", value: "attachment"},
              {label: "Link", value: "link"},
            ]}
          />
          <Resource.Form.KindAttributes />
          <Form.Save
            text="Update Resource"
          />
        </FormContainer.Form>
      </section>
    );
  }
}

export default connect(
  ResourceDetailGeneralContainer.mapStateToProps
)(ResourceDetailGeneralContainer);
