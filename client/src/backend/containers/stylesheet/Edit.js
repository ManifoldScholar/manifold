import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import { stylesheetsAPI, requests, sectionsAPI } from "api";
import { select } from "utils/entityUtils";
import Form from "global/components/form";
import lh from "helpers/linkHandler";
import FormContainer from "global/containers/form";
import { entityStoreActions } from "actions";
import has from "lodash/has";
import Collapse from "global/components/Collapse";
import SectionFields from "./SectionFields";

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
    stylesheet: PropTypes.object,
    t: PropTypes.func
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

    const t = this.props.t;

    return (
      <section>
        <FormContainer.Form
          model={this.stylesheet}
          name={name}
          update={stylesheetsAPI.update}
          create={this.create}
          onSuccess={this.redirectToStylesheet}
          className="form-secondary"
        >
          {getModelValue => (
            <>
              {this.stylesheet.attributes.ingested ? (
                <Form.Instructions
                  instructions={t("texts.stylesheets.edit.instructions")}
                />
              ) : null}
              <Form.TextInput
                label={t("texts.stylesheets.edit.name_label")}
                name="attributes[name]"
                placeholder={t("texts.stylesheets.edit.name_label")}
                wide
              />
              <Form.CodeArea
                label={t("texts.stylesheets.edit.source_styles_label")}
                height="300px"
                mode="css"
                name="attributes[rawStyles]"
                instructions={t(
                  "texts.stylesheets.edit.source_styles_instructions"
                )}
              />
              <Form.CodeArea
                label={t("texts.stylesheets.edit.validated_styles_label")}
                name="attributes[styles]"
                mode="css"
                instructions={t(
                  "texts.stylesheets.edit.validated_styles_instructions"
                )}
                readOnly
              />
              <Collapse
                initialVisible={
                  !getModelValue("attributes[appliesToAllTextSections]")
                }
              >
                <SectionFields
                  options={this.fetchTextSections}
                  visible={
                    !getModelValue("attributes[appliesToAllTextSections]")
                  }
                />
              </Collapse>
              <Form.Save
                cancelRoute={lh.link("backendTextStyles", params.id)}
                text={t("texts.stylesheets.edit.save")}
              />
            </>
          )}
        </FormContainer.Form>
      </section>
    );
  }
}

export default withTranslation()(connectAndFetch(StylesheetEditContainer));
