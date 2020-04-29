import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { stylesheetsAPI, requests, sectionsAPI } from "api";
import { select } from "utils/entityUtils";
import Form from "global/components/form";
import lh from "helpers/linkHandler";
import FormContainer from "global/containers/form";
import { entityStoreActions } from "actions";
import has from "lodash/has";

const { request } = entityStoreActions;

export class StylesheetEditContainer extends PureComponent {
  static fetchData = (getState, dispatch, location, match) => {
    if (!match.params.stylesheet) return;
    const call = stylesheetsAPI.show(match.params.stylesheet);
    const stylesheet = request(call, requests.beStylesheetShow);
    return dispatch(stylesheet);
  };

  static mapStateToProps = state => ({
    stylesheet: select(requests.beStylesheetShow, state.entityStore)
  });

  static displayName = "Stylesheet.Edit";

  static propTypes = {
    match: PropTypes.object,
    refresh: PropTypes.func,
    stylesheet: PropTypes.object
  };

  get isNew() {
    const { params } = this.props.match;
    return !has(params, "stylesheet");
  }

  get isEdit() {
    return !this.isNew;
  }

  get stylesheet() {
    if (this.isNew)
      return { attributes: {}, relationships: { textSections: [] } };
    return this.props.stylesheet;
  }

  get text() {
    return this.props.text;
  }

  redirectToStylesheet = stylesheet => {
    const path = lh.link(
      "BackendTextStylesheetEdit",
      this.text.id,
      stylesheet.id
    );
    this.props.history.push(path);
  };

  create = attributes => {
    return stylesheetsAPI.create(this.props.match.params.id, attributes);
  };

  fetchTextSections = () => {
    return sectionsAPI.forText(this.props.text.id);
  };

  render() {
    if (this.isEdit && !this.stylesheet) return null;

    const { params } = this.props.match;
    const name = this.isNew
      ? requests.beStylesheetCreate
      : requests.beStylesheetUpdate;

    return (
      <div>
        <section>
          <section className="form-section form-section--primary">
            <FormContainer.Form
              model={this.stylesheet}
              name={name}
              update={stylesheetsAPI.update}
              create={this.create}
              onSuccess={this.redirectToStylesheet}
              className="form-secondary"
            >
              <div className="form-input">
                <p className="instructions">
                  {this.stylesheet.attributes.ingested
                    ? "This stylesheet was ingested as part of the source document. You may " +
                      "make changes to it. However, if the source document is reingested, " +
                      "those changes will be lost. If you'd like to add styles to this " +
                      "text consider creating a new, supplemental stylesheet rather than " +
                      "modifying this one."
                    : null}
                </p>
              </div>
              <Form.TextInput
                label="Name"
                name="attributes[name]"
                placeholder="Name"
              />
              <Form.CodeArea
                label="Source Styles"
                height="300px"
                mode="css"
                name="attributes[rawStyles]"
                instructions="These are the raw source styles, which can be edited."
              />
              <Form.CodeArea
                label="Validated Styles"
                name="attributes[styles]"
                mode="css"
                instructions={
                  "The following input is read-only. It contains the validated " +
                  "styles that are included in the reader for this text."
                }
                readOnly
              />
              <Form.Picker
                label="Apply to these text sections"
                placeholder={"Add a text section"}
                name="relationships[textSections]"
                optionToLabel={t => t.attributes.name}
                options={this.fetchTextSections}
                rowProps={{ namePath: "attributes.title" }}
                showAddRemoveAll
              />

              <Form.Save
                cancelRoute={lh.link("backendTextStyles", params.id)}
                text="Save Stylesheet"
              />
            </FormContainer.Form>
          </section>
        </section>
      </div>
    );
  }
}

export default connectAndFetch(StylesheetEditContainer);
