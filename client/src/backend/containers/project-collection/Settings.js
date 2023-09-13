import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import withConfirmation from "hoc/withConfirmation";
import ProjectCollection from "backend/components/project-collection";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { projectCollectionsAPI, requests } from "api";
import lh from "helpers/linkHandler";

import Authorize from "hoc/Authorize";

export class ProjectCollectionSettings extends PureComponent {
  static displayName = "ProjectCollection.Settings";

  static propTypes = {
    projectCollection: PropTypes.object,
    projectCollectionMeta: PropTypes.object,
    confirm: PropTypes.func.isRequired,
    buildUpdateProjectCollection: PropTypes.func.isRequired
  };

  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  handleDestroy = () => {
    const t = this.props.t;
    const heading = t("modals.delete_project_collection");
    const message = t("modals.confirm_body");
    this.props.confirm(heading, message, this.props.destroyProjectCollection);
  };

  onSuccess = () => {
    this.props.refreshCollectionProjects();
    this.props.history.push(
      lh.link("backendProjectCollection", this.props.projectCollection.id)
    );
  };

  render() {
    const { projectCollection, t } = this.props;
    if (!projectCollection) return null;

    const formatData = data => {
      const { heroAltText, hero, ...rest } = data?.attributes ?? {};

      const finalHeroData =
        typeof heroAltText === "string"
          ? { ...hero, altText: heroAltText }
          : hero;

      const relationships = data.relationships?.subjects
        ? { subjects: { data: data.relationships?.subjects } }
        : {};

      return {
        relationships,
        attributes: { hero: finalHeroData, ...rest }
      };
    };

    return (
      <Authorize
        entity={projectCollection}
        ability="update"
        failureNotification
        failureRedirect={lh.link(
          "backendProjectCollection",
          projectCollection.id
        )}
      >
        <section>
          <FormContainer.Form
            model={projectCollection}
            name={requests.beProjectCollectionUpdate}
            update={this.props.buildUpdateProjectCollection}
            create={projectCollectionsAPI.create}
            onSuccess={this.onSuccess}
            className="form-secondary project-collection-form"
            flushOnUnmount={false}
            formatData={formatData}
          >
            <ProjectCollection.Form.Fields
              handleDestroy={this.handleDestroy}
              {...this.props}
            />
            <Form.Save text={t("project_collections.save_button_label")} />
          </FormContainer.Form>
        </section>
      </Authorize>
    );
  }
}

export default withTranslation()(withConfirmation(ProjectCollectionSettings));
