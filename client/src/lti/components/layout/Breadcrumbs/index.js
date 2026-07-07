import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function Breadcrumbs({ project, entity, type }) {
  const { t } = useTranslation();
  const location = useLocation();
  const search = location.state?.search;

  const searchCrumb = {
    label: t("lti.breadcrumb.search"),
    to: `/lti/search${search ?? ""}`
  };

  const projectCrumb = project
    ? {
        label: t("lti.breadcrumb.project", {
          title: project.attributes.titlePlaintext
        }),
        to: `/lti/projects/${project.id}`
      }
    : undefined;

  const getEntityCrumb = () => {
    switch (type) {
      case "project":
        return {
          label: t("lti.breadcrumb.project", {
            title: entity.attributes.titlePlaintext
          }),
          to: `/lti/projects/${entity.id}`,
          current: true
        };
      case "text":
        return {
          label: t("lti.breadcrumb.text", {
            title: entity.attributes.title
          }),
          to: `/lti/texts/${entity.id}`,
          current: true
        };
      case "resourceCollection":
        return {
          label: t("lti.breadcrumb.resourceCollection", {
            title: entity.attributes.title
          }),
          to: `/lti/resource-collections/${entity.id}`,
          current: true
        };
      default:
        return undefined;
    }
  };

  const crumbs = [searchCrumb, projectCrumb, getEntityCrumb()].filter(Boolean);

  return (
    <Styled.Nav data-lti-breadcrumb>
      {crumbs.map((crumb, i) => {
        return (
          <span key={crumb.to}>
            {i > 0 && (
              <Styled.Separator aria-hidden="true">
                <IconComposer icon="disclosureDown16" size={16} />
              </Styled.Separator>
            )}
            {crumb.current ? (
              <span aria-current="page">{crumb.label}</span>
            ) : (
              <Link to={crumb.to} state={{ search }}>
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </Styled.Nav>
  );
}
