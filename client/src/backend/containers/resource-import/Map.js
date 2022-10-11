import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import connectAndFetch from "utils/connectAndFetch";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";
import { withTranslation } from "react-i18next";

export class ResourceImportMap extends PureComponent {
  static displayName = "ResourceImport.Map";

  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    resourceImport: PropTypes.object.isRequired
  };

  componentDidMount() {
    const { resourceImport } = this.props;
    if (resourceImport.attributes.state === "pending") {
      const { projectId } = this.props.match.params;
      const url = lh.link(
        "backendResourceImportEdit",
        projectId,
        resourceImport.id
      );
      this.props.history.push(url);
    }
  }

  onSuccess = model => {
    const { projectId } = this.props.match.params;
    const importId = model.id;
    const url = lh.link("backendResourceImportResults", projectId, importId);
    this.props.history.push(url);
  };

  get buttonClasses() {
    return classNames(
      "buttons-icon-horizontal__button",
      "button-icon-secondary"
    );
  }

  backLinkUrl() {
    const { match } = this.props;
    return lh.link(
      "backendResourceImportEdit",
      match.params.projectId,
      match.params.id
    );
  }

  create = model => {
    return this.props.create(this.preSave(model));
  };

  update = (id, model) => {
    return this.props.update(id, this.preSave(model));
  };

  /* eslint-disable no-param-reassign */
  preSave = model => {
    model.attributes.state = "mapped";
    return model;
  };
  /* eslint-enable no-param-reassign */

  render() {
    const { resourceImport, t } = this.props;

    return (
      <div>
        <FormContainer.Form
          model={resourceImport}
          name="backend-resource-import-update"
          create={this.create}
          update={this.update}
          onSuccess={this.onSuccess}
          className="form-secondary"
        >
          <Form.FieldGroup label={t("resources.import.step_three_header")}>
            <Form.AttributeMap
              instructions={t("forms.attribute_map.instructions")}
              name="attributes[columnMap]"
              attributes="attributes[availableColumns]"
              headers="attributes[headers]"
            />
            <div className="buttons-icon-horizontal">
              <Link
                to={this.backLinkUrl()}
                className={classNames(
                  this.buttonClasses,
                  "button-icon-secondary--dull"
                )}
              >
                <IconComposer
                  icon="close16"
                  size="default"
                  className="button-icon-secondary__icon"
                />
                <span>{t("actions.back")}</span>
              </Link>
              <button type="submit" className={this.buttonClasses}>
                <IconComposer
                  icon="checkmark16"
                  size="default"
                  className="button-icon-secondary__icon"
                />
                <span>{t("actions.continue")}</span>
              </button>
            </div>
          </Form.FieldGroup>
        </FormContainer.Form>
      </div>
    );
  }
}

export default withTranslation()(connectAndFetch(ResourceImportMap));
