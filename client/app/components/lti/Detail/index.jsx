import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import SearchResult from "components/lti/Search/Results/Result";
import Category from "./Category";
import Button from "components/global/atomic/Button";
import Breadcrumbs from "components/lti/layout/Breadcrumbs";
import * as Styled from "./styles";

export default function DetailLayout({ type, entity, categories = [] }) {
  const { t } = useTranslation();
  const location = useLocation();
  const search = location.state?.search;

  const project =
    type !== "project" ? entity.relationships?.project : undefined;

  return (
    <Styled.Spacer>
      <Breadcrumbs type={type} entity={entity} project={project} />
      <SearchResult type={type} entity={entity} />
      {categories.map(category => (
        <Category key={category.type} {...category} />
      ))}
      <Button
        as={Link}
        to={`/lti/search${search ?? ""}`}
        state={{ search }}
        label={t("lti.actions.back_to_search")}
        preIcon="arrowLeft16"
        background="outline"
        shape="lozenge"
        lowercase
        size="xSm"
      />
    </Styled.Spacer>
  );
}
