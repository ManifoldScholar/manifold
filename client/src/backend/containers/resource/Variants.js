import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import Resource from "backend/components/resource";
import { resourcesAPI } from "api";
import { connect } from "react-redux";

export class ResourceVariantsContainer extends PureComponent {
  static displayName = "Resource.Variants";

  static propTypes = {
    resource: PropTypes.object,
    params: PropTypes.object,
    t: PropTypes.func
  };

  render() {
    return (
      <section>
        <FormContainer.Form
          model={this.props.resource}
          name="backend-resource-update"
          update={resourcesAPI.update}
          create={model =>
            resourcesAPI.create(this.props.params.projectId, model)
          }
          className="form-secondary"
        >
          <Resource.Form.Kind.Variants
            kind={this.props.resource.attributes.kind}
            {...this.props}
          />
          <Form.Save text={this.props.t("resources.properties.save")} />
        </FormContainer.Form>
      </section>
    );
  }
}

export default withTranslation()(
  connect(ResourceVariantsContainer.mapStateToProps)(ResourceVariantsContainer)
);
