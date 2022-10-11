import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import connectAndFetch from "utils/connectAndFetch";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";
import { withTranslation } from "react-i18next";

export class ResourceImportNew extends PureComponent {
  static displayName = "ResourceImport.New";

  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    resourceImport: PropTypes.object
  };

  onSuccess = model => {
    const { projectId } = this.props.match.params;
    const importId = model.id;
    const url = lh.link("backendResourceImportMap", projectId, importId);
    this.props.history.push(url);
  };

  get buttonClasses() {
    return classNames(
      "buttons-icon-horizontal__button",
      "button-icon-secondary"
    );
  }

  afterUrlChange = (value, set, setOther) => {
    if (value) {
      setOther("google_sheet", "attributes[source]");
      setOther(null, "attributes[data]");
    }
  };

  afterSourceChange = (value, set, setOther) => {
    if (value) {
      setOther("attached_data", "attributes[source]");
      setOther(null, "attributes[url]");
    }
  };

  create = model => {
    return this.props.create(this.preSave(model));
  };

  update = (id, model) => {
    return this.props.update(id, this.preSave(model));
  };

  /* eslint-disable no-param-reassign */
  preSave = model => {
    model.attributes.state = "parsing";
    model.attributes.storageType = "google_drive";
    return model;
  };
  /* eslint-enable no-param-reassign */

  headerRowOptions = () => {
    return [1, 2, 3, 4, 5, 6].map(i => {
      return { label: i.toString(), value: i };
    });
  };

  render() {
    const { resourceImport, t } = this.props;
    return (
      <FormContainer.Form
        model={resourceImport || null}
        name="backend-resource-import-create"
        create={this.create}
        update={this.update}
        onSuccess={this.onSuccess}
        groupErrors
        className="form-secondary"
      >
        {resourceImport && resourceImport.attributes.parseError ? (
          <Form.InputError
            errors={[
              {
                detail: t("resources.import.parse_error")
              }
            ]}
          />
        ) : null}
        <Form.FieldGroup label={t("resources.import.step_one_header")}>
          <Form.Upload
            wide
            label={t("resources.import.upload_instructions")}
            accepts="csv"
            layout="horizontal"
            afterChange={this.afterSourceChange}
            name="attributes[data]"
            readFrom="attributes[dataFilename]"
          />
          <Form.Divider>{t("common.or")}</Form.Divider>
          <Form.TextInput
            wide
            label={t("resources.import.sheets_url")}
            afterChange={this.afterUrlChange}
            instructions={t("resources.import.sheets_instructions")}
            name="attributes[url]"
          />
        </Form.FieldGroup>
        <Form.FieldGroup label={t("resources.import.step_two_header")}>
          <Form.Select
            label={t("resources.import.headers_label")}
            options={this.headerRowOptions()}
            name="attributes[headerRow]"
            instructions={t("resources.import.headers_instructions")}
          />
          <Form.TextInput
            label={t("resources.import.storage_identifier_label")}
            name="attributes[storageIdentifier]"
            instructions={t("resources.import.storage_identifier_instructions")}
          />
        </Form.FieldGroup>
        <div className="buttons-icon-horizontal right">
          <button type="submit" className={this.buttonClasses}>
            <IconComposer
              icon="checkmark16"
              size="default"
              className="button-icon-secondary__icon"
            />
            <span>{t("actions.continue")}</span>
          </button>
        </div>
      </FormContainer.Form>
    );
  }
}

export default withTranslation()(connectAndFetch(ResourceImportNew));
