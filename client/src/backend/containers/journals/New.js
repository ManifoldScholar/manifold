import React, { PureComponent } from "react";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Authorize from "hoc/Authorize";
import Layout from "backend/components/layout";
import PageHeader from "backend/components/layout/PageHeader";
import { journalsAPI } from "api";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";

class JournalsNew extends PureComponent {
  static displayName = "Journals.New";

  static propTypes = {
    history: PropTypes.object
  };

  redirectToJournal(journal) {
    const path = lh.link("backendJournal", journal.id);
    this.props.history.push(path);
  }

  handleSuccess = journal => {
    this.redirectToJournal(journal);
  };

  render() {
    const t = this.props.t;

    const breadcrumbs = [
      {
        to: lh.link("backendJournals"),
        label: t("glossary.journal_title_case_other")
      },
      {
        to: lh.link("backendJournalsNew"),
        label: t("common.new")
      }
    ];

    return (
      <Authorize
        entity={"journal"}
        ability="create"
        failureNotification
        failureRedirect={lh.link("backend")}
      >
        <HeadContent
          title={`${t(`titles.journal_new`)} | ${t("common.admin")}`}
          appendDefaultTitle
        />
        <div>
          <RegisterBreadcrumbs breadcrumbs={breadcrumbs ?? []} />
          <PageHeader
            type="journal"
            title={t("journals.forms.new_header")}
            note={t("journals.forms.new_instructions")}
          />
          <Layout.BackendPanel>
            <FormContainer.Form
              name="backend-create-journal"
              update={journalsAPI.update}
              create={journalsAPI.create}
              onSuccess={this.handleSuccess}
              className="form-secondary"
            >
              <Form.FieldGroup label={t("journals.forms.title_descript_label")}>
                <Form.TextInput
                  validation={["required"]}
                  focusOnMount
                  label={t("journals.forms.title_label")}
                  name="attributes[title]"
                  placeholder={t("journals.forms.title_placeholder")}
                />
                <Form.TextInput
                  label={t("journals.forms.subtitle_label")}
                  name="attributes[subtitle]"
                  placeholder={t("journals.forms.subtitle_placeholder")}
                />
                <Form.TextArea
                  label={t("journals.forms.descript_label")}
                  name="attributes[description]"
                  height={100}
                  wide
                />
              </Form.FieldGroup>
              <Form.Save
                text={t("journals.forms.submit_label")}
                cancelRoute={lh.link("backendJournals")}
              />
            </FormContainer.Form>
          </Layout.BackendPanel>
        </div>
      </Authorize>
    );
  }
}

export default withTranslation()(JournalsNew);
