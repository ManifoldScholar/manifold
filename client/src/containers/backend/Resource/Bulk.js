import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Form as FormContainer } from "containers/backend";
import { Resource, Navigation, Form } from "components/backend";
import { resourcesAPI } from "api";
import lh from "helpers/linkHandler";

export class ResourceBulkContainer extends PureComponent {
  static displayName = "Resource.Bulk";
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      fileLoaded: false
    }
  }

  render() {
    const { match } = this.props;

    return (
      <div>
        <Navigation.DetailHeader
          type="resources"
          breadcrumb={[
            {
              path: lh.link("backendProjectResources", match.params.projectId),
              label: "Resources"
            }
          ]}
          title={"Bulk Add Resources"}
          showUtility={false}
          note={
            "Add a data file with multiple resources," +
            " then map resource fileds to columns in the data file."
          }
        />
        <section className="backend-panel">
          <div className="container">
            <div className="panel">
              <FormContainer.Form
                name="backend-resource-create"
                create={() => {console.log('create');}}
                update={() => {console.log('update');}}
                onSuccess={() => {console.log('success');}}
                className="form-secondary"
              >
                <Form.FieldGroup label="Page 1: Upload">
                  <Form.Upload
                    label="Upload a CSV (File with Comma Separated Values)"
                    accepts="csv"
                    layout="horizontal"
                    name="attributes[csv]"
                    {...this.props}
                  />

                  <div className="form-divider">or</div>

                  <Form.TextInput
                    focusOnMount
                    label="Google Sheets URL"
                    instructions="You can also import resources listed in a Google Sheet"
                    name="attributes[google]"
                  />

                  <div className="buttons-icon-horizontal right" style={{
                    marginTop: '30px'
                  }}>
                    <button type="submit" className="button-icon-secondary" disabled="disabled">
                      <i className="manicon manicon-check small"></i>Continue
                    </button>
                  </div>
                </Form.FieldGroup>
                <Form.FieldGroup
                  label="Page 2: Match Columns"
                >
                  <div className="form-input">
                    <button
                        to={this.props.cancelRoute}
                        className="button-secondary outlined"
                      >
                      {'Automatically Map Columns'}
                    </button>
                  </div>
                  <Form.ColumnMap>
                  </Form.ColumnMap>
                </Form.FieldGroup>
                <div className="buttons-icon-horizontal" style={{
                  marginTop: '45px'
                }}>
                  <button className="button-icon-secondary dull" disabled="disabled">
                    <i className="manicon manicon-x small"></i>Back
                  </button>
                  <button type="submit" className="button-icon-secondary" disabled="disabled">
                    <i className="manicon manicon-check small"></i>Continue
                  </button>
                </div>
              </FormContainer.Form>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connectAndFetch(ResourceBulkContainer);
