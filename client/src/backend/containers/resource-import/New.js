import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import FormContainer from "backend/containers/form";
import Form from "backend/components/form";
import connectAndFetch from "utils/connectAndFetch";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";

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
    const { resourceImport } = this.props;
    return (
      <FormContainer.Form
        model={resourceImport || null}
        name="backend-resource-create"
        create={this.create}
        update={this.update}
        onSuccess={this.onSuccess}
        groupErrors
        className="form-secondary"
      >
        {resourceImport && resourceImport.attributes.parseError ? (
          <div className="form-error form-input form-error-grouped">
            <span className="errors">
              <span className="error" role="alert">
                {`Manifold was unable to parse the import data. If the source is a google
                sheet, check to be sure that the sheet is publicly accessible (or that
                it's accessible to your Google integration service account) and that the
                URL is correct.`}
              </span>
            </span>
          </div>
        ) : null}
        <Form.FieldGroup label="Step 1: Upload">
          <Form.Upload
            wide
            label="Upload a CSV (File with Comma Separated Values)"
            accepts="csv"
            layout="horizontal"
            afterChange={this.afterSourceChange}
            name="attributes[data]"
            readFrom="attributes[dataFilename]"
          />
          <div className="form-divider wide">or</div>
          <Form.TextInput
            wide
            label="Google Sheets URL"
            afterChange={this.afterUrlChange}
            instructions="You can also import resources listed in a Google Sheet"
            name="attributes[url]"
          />
        </Form.FieldGroup>
        <Form.FieldGroup label="Step 2: Describe Data">
          <Form.Select
            label="Which row contains the column headers?"
            options={this.headerRowOptions()}
            name="attributes[headerRow]"
            instructions="The import assumes that the row immediately following the header
             row is the first row of data. All rows above the header row are ignored."
          />
          <Form.TextInput
            label="Enter the Storage Identifier"
            name="attributes[storageIdentifier]"
            instructions="In the case of Google Drive, this will be the ID, which is the
            last part of the folder's URL"
          />
        </Form.FieldGroup>
        <div
          className="buttons-icon-horizontal right"
          style={{
            marginTop: "30px"
          }}
        >
          <button type="submit" className={this.buttonClasses}>
            <IconComposer
              icon="check16"
              size="default"
              iconClass="button-icon-secondary__icon"
            />
            <span>Continue</span>
          </button>
        </div>
      </FormContainer.Form>
    );
  }
}

export default connectAndFetch(ResourceImportNew);
