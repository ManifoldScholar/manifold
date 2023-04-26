import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import PageHeader from "backend/components/layout/PageHeader";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";
import { withTranslation } from "react-i18next";
import * as Styled from "./styles";

class ProjectCollectionHeader extends PureComponent {
  static displayName = "ProjectCollection.Header";

  static propTypes = {
    projectCollection: PropTypes.object,
    t: PropTypes.func
  };

  get iconName() {
    return this.props.projectCollection.attributes.smart
      ? "BECollectionSmart64"
      : "BECollectionManual64";
  }

  renderUtility = projectCollection => {
    const smart = projectCollection.attributes.smart;
    const t = this.props.t;

    return (
      <div className="utility-button-group utility-button-group--inline">
        <Link
          to={lh.link(
            "frontendProjectCollection",
            projectCollection.attributes.slug
          )}
          className="utility-button"
        >
          <IconComposer
            icon="eyeOpen32"
            size={26}
            className="utility-button__icon utility-button__icon--highlight"
          />
          <span className="utility-button__text">{t("actions.view")}</span>
        </Link>
        <Link
          to={lh.link("backendProjectCollectionSettings", projectCollection.id)}
          className="utility-button"
        >
          <IconComposer
            icon="settings32"
            size={26}
            className="utility-button__icon utility-button__icon--highlight"
          />
          <span className="utility-button__text">{t("common.settings")}</span>
        </Link>
        {!smart ? (
          <Link
            to={lh.link(
              "backendProjectCollectionManageProjects",
              projectCollection.id
            )}
            className="utility-button"
          >
            <IconComposer
              icon="BEProject64"
              size={26}
              className="utility-button__icon utility-button__icon--highlight"
            />
            <span className="utility-button__text">
              {t("project_collections.manage", {
                entity: t("glossary.project_other")
              })}
            </span>
          </Link>
        ) : null}
      </div>
    );
  };

  renderPlaceholder() {
    const t = this.props.t;

    return (
      <PageHeader
        type="projectCollection"
        title={
          <Styled.EmptyHeader>
            <h1 className="screen-reader-text">
              {t("glossary.project_collection_title_case_other")}
            </h1>
            <span>
              {t("project_collections.manage_collection_instructions")}
            </span>
          </Styled.EmptyHeader>
        }
      />
    );
  }

  render() {
    const { projectCollection } = this.props;
    if (!projectCollection) return this.renderPlaceholder();

    return (
      <PageHeader
        icon={this.iconName}
        type="projectCollection"
        title={projectCollection.attributes.title}
        utility={this.renderUtility(projectCollection)}
      />
    );
  }
}

export default withTranslation()(ProjectCollectionHeader);
