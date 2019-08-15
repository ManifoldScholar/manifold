import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { stylesheetsAPI, requests } from "api";
import { select } from "utils/entityUtils";
import Stylesheet from "backend/components/stylesheet";
import Form from "global/components/form";
import lh from "helpers/linkHandler";
import { Redirect } from "react-router-dom";
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

  constructor(props) {
    super(props);

    this.state = { redirect: null };
  }

  onSuccess = () => {
    if (!__BROWSER__) return;
    window.scrollTo(0, 0);
    this.props.refresh();
  };

  create = attributes => {
    return stylesheetsAPI.create(this.props.match.params.id, attributes);
  };

  renderEdit(isNew) {
    const { stylesheet } = this.props;
    return (
      <div>
        <section>
          {isNew ? this.renderForm() : this.renderForm(stylesheet)}
        </section>
      </div>
    );
  }

  renderForm(stylesheet) {
    const { params } = this.props.match;
    const name = stylesheet
      ? requests.beStylesheetUpdate
      : requests.beStylesheetCreate;

    return (
      <section className="form-section form-section--primary">
        <FormContainer.Form
          model={stylesheet}
          name={name}
          update={stylesheetsAPI.update}
          create={this.create}
          onSuccess={this.onSuccess}
          className="form-secondary"
        >
          <div className="form-input">
            <p className="instructions">
              {stylesheet && stylesheet.attributes.ingested
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
          <Stylesheet.Form.TextSections
            stylesheet={stylesheet}
            wide
            {...this.props}
          />
          <Form.Save
            cancelRoute={lh.link("backendTextStyles", params.id)}
            text="Save Stylesheet"
          />
        </FormContainer.Form>
      </section>
    );
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    const { params } = this.props.match;
    const isNew = !has(params, "stylesheet");
    return this.renderEdit(isNew);
  }
}

export default connectAndFetch(StylesheetEditContainer);
