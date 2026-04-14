import { useTranslation } from "react-i18next";
import PageHeader from "components/backend/layout/PageHeader";
import * as Styled from "./styles";

export default function ProjectCollectionHeader({ projectCollection }) {
  const { t } = useTranslation();

  if (!projectCollection) {
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

  const iconName = projectCollection.attributes.smart
    ? "BECollectionSmart64"
    : "BECollectionManual64";

  const smart = projectCollection.attributes.smart;

  const base = [
    {
      label: "actions.view",
      path: `/project-collection/${projectCollection.attributes.slug}`,
      icon: "eyeOpen32"
    },
    {
      label: "common.settings",
      path: `/backend/projects/project-collections/${projectCollection.id}/settings`,
      icon: "settings32"
    }
  ];

  const manage = !smart
    ? [
        {
          label: t("project_collections.manage", {
            entity: t("glossary.project_other")
          }),
          path: `/backend/projects/project-collections/${projectCollection.id}/manage-projects`,
          icon: "BEProject64"
        }
      ]
    : [];

  const utility = [...base, ...manage];

  return (
    <PageHeader
      icon={iconName}
      type="projectCollection"
      title={projectCollection.attributes.title}
      actions={utility}
      hideBreadcrumbs
    />
  );
}

ProjectCollectionHeader.displayName = "ProjectCollection.Header";
