import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import PageHeader from "backend/components/layout/PageHeader";
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

  get utility() {
    const { projectCollection, t } = this.props;
    const smart = projectCollection.attributes.smart;

    const base = [
      {
        label: "actions.view",
        route: "frontendProjectCollection",
        slug: projectCollection.attributes.slug,
        icon: "eyeOpen32"
      },
      {
        label: "common.settings",
        route: "backendProjectCollectionSettings",
        slug: projectCollection.id,
        icon: "settings32"
      }
    ];

    const manage = !smart
      ? [
          {
            label: t("project_collections.manage", {
              entity: t("glossary.project_other")
            }),
            route: "backendProjectCollectionManageProjects",
            slug: projectCollection.id,
            icon: "BEProject64"
          }
        ]
      : [];

    return [...base, ...manage];
  }

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
        hideBreadcrumbs
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
        actions={this.utility}
        hideBreadcrumbs
      />
    );
  }
}

export default withTranslation()(ProjectCollectionHeader);
