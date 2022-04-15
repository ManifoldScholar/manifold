import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Navigation from "backend/components/navigation";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";
import { withTranslation } from "react-i18next";

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
              {t("backend.forms.manage_entity", {
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
      <section className="backend-header">
        <div className="backend-header__inner backend-header__inner--empty">
          <header className="backend-header__empty-text">
            <h1 className="screen-reader-text">
              {t("glossary.project_collection_title_case_other")}
            </h1>
            <span>
              {t("backend.project_collection.manage_collection_instructions")}
            </span>
          </header>
        </div>
      </section>
    );
  }

  render() {
    const { projectCollection } = this.props;
    if (!projectCollection) return this.renderPlaceholder();

    return (
      <Navigation.DetailHeader
        iconName={this.iconName}
        type="projectCollection"
        title={projectCollection.attributes.title}
        utility={this.renderUtility(projectCollection)}
        backUrl={lh.link("backendProjectCollections")}
      />
    );
  }
}

export default withTranslation()(ProjectCollectionHeader);
